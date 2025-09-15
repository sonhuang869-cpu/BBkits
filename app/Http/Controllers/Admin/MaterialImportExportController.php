<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialCategory;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MaterialImportExportController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved', 'materials.access:view']);
        $this->middleware('materials.access:create')->only(['import', 'processImport']);
        $this->middleware('materials.access:edit')->only(['import', 'processImport']);
    }

    public function index()
    {
        return Inertia::render('Admin/Materials/ImportExport', [
            'stats' => [
                'total_materials' => Material::count(),
                'total_categories' => MaterialCategory::count(),
                'total_suppliers' => Supplier::count(),
            ],
        ]);
    }

    public function exportTemplate()
    {
        $headers = [
            'reference',
            'name',
            'description',
            'unit',
            'category_code',
            'supplier_name',
            'purchase_price',
            'current_stock',
            'minimum_stock',
            'lead_time_days',
            'purchase_multiple',
            'weight_per_unit',
            'is_active',
        ];

        $filename = 'materials_template_' . date('Y-m-d_H-i-s') . '.csv';

        $callback = function () use ($headers) {
            $file = fopen('php://output', 'w');

            // Add BOM for Excel UTF-8 support
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Add headers
            fputcsv($file, $headers);

            // Add example row
            fputcsv($file, [
                'REF001',
                'Material de Exemplo',
                'Descrição do material de exemplo',
                'kg',
                'METAL',
                'Fornecedor ABC',
                '10.50',
                '100.000',
                '10.000',
                '7',
                '1',
                '0.500',
                '1',
            ]);

            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function export(Request $request)
    {
        $query = Material::with(['category', 'supplier']);

        // Apply filters if provided
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('supplier_id') && $request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->has('active_only') && $request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        $materials = $query->get();

        $filename = 'materials_export_' . date('Y-m-d_H-i-s') . '.csv';

        $callback = function () use ($materials) {
            $file = fopen('php://output', 'w');

            // Add BOM for Excel UTF-8 support
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Add headers
            fputcsv($file, [
                'reference',
                'name',
                'description',
                'unit',
                'category_code',
                'category_name',
                'supplier_name',
                'purchase_price',
                'current_stock',
                'minimum_stock',
                'lead_time_days',
                'purchase_multiple',
                'weight_per_unit',
                'is_active',
                'created_at',
                'updated_at',
            ]);

            // Add data rows
            foreach ($materials as $material) {
                fputcsv($file, [
                    $material->reference,
                    $material->name,
                    $material->description,
                    $material->unit,
                    $material->category?->code,
                    $material->category?->name,
                    $material->supplier?->name,
                    $material->purchase_price,
                    $material->current_stock,
                    $material->minimum_stock,
                    $material->lead_time_days,
                    $material->purchase_multiple,
                    $material->weight_per_unit,
                    $material->is_active ? '1' : '0',
                    $material->created_at?->format('Y-m-d H:i:s'),
                    $material->updated_at?->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $file->storeAs('imports', 'materials_' . time() . '.csv');

        try {
            $results = $this->processImportFile($path);

            // Clean up the file
            Storage::delete($path);

            return response()->json([
                'success' => true,
                'message' => 'Importação processada com sucesso!',
                'results' => $results,
            ]);

        } catch (\Exception $e) {
            // Clean up the file
            Storage::delete($path);

            return response()->json([
                'success' => false,
                'message' => 'Erro durante a importação: ' . $e->getMessage(),
            ], 422);
        }
    }

    private function processImportFile($path)
    {
        $fullPath = Storage::path($path);
        $file = fopen($fullPath, 'r');

        if (!$file) {
            throw new \Exception('Não foi possível abrir o arquivo');
        }

        $results = [
            'total_rows' => 0,
            'processed' => 0,
            'created' => 0,
            'updated' => 0,
            'errors' => [],
            'warnings' => [],
        ];

        // Skip BOM if present
        $bom = fread($file, 3);
        if ($bom !== chr(0xEF).chr(0xBB).chr(0xBF)) {
            rewind($file);
        }

        // Read headers
        $headers = fgetcsv($file);
        if (!$headers) {
            throw new \Exception('Arquivo CSV inválido - cabeçalhos não encontrados');
        }

        // Validate required headers
        $requiredHeaders = ['reference', 'name', 'unit'];
        foreach ($requiredHeaders as $required) {
            if (!in_array($required, $headers)) {
                throw new \Exception("Campo obrigatório '{$required}' não encontrado no cabeçalho");
            }
        }

        $lineNumber = 2; // Start from line 2 (after headers)

        // Cache lookups
        $categories = MaterialCategory::pluck('id', 'code');
        $suppliers = Supplier::pluck('id', 'name');

        DB::beginTransaction();

        try {
            while (($row = fgetcsv($file)) !== FALSE) {
                $results['total_rows']++;

                if (empty(array_filter($row))) {
                    continue; // Skip empty rows
                }

                $data = array_combine($headers, $row);

                try {
                    $materialData = $this->validateAndPrepareRow($data, $categories, $suppliers, $lineNumber);

                    // Check if material exists by reference
                    $material = Material::where('reference', $materialData['reference'])->first();

                    if ($material) {
                        // Update existing material
                        $material->update($materialData);
                        $results['updated']++;
                    } else {
                        // Create new material
                        Material::create($materialData);
                        $results['created']++;
                    }

                    $results['processed']++;

                } catch (\Exception $e) {
                    $results['errors'][] = "Linha {$lineNumber}: " . $e->getMessage();
                }

                $lineNumber++;
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        fclose($file);
        return $results;
    }

    private function validateAndPrepareRow($data, $categories, $suppliers, $lineNumber)
    {
        $validator = Validator::make($data, [
            'reference' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:20',
            'purchase_price' => 'nullable|numeric|min:0',
            'current_stock' => 'nullable|numeric|min:0',
            'minimum_stock' => 'nullable|numeric|min:0',
            'lead_time_days' => 'nullable|integer|min:0',
            'purchase_multiple' => 'nullable|integer|min:1',
            'weight_per_unit' => 'nullable|numeric|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            throw new \Exception(implode(', ', $validator->errors()->all()));
        }

        $materialData = [
            'reference' => $data['reference'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'unit' => $data['unit'],
            'purchase_price' => isset($data['purchase_price']) ? (float)$data['purchase_price'] : 0,
            'current_stock' => isset($data['current_stock']) ? (float)$data['current_stock'] : 0,
            'minimum_stock' => isset($data['minimum_stock']) ? (float)$data['minimum_stock'] : 0,
            'lead_time_days' => isset($data['lead_time_days']) ? (int)$data['lead_time_days'] : 0,
            'purchase_multiple' => isset($data['purchase_multiple']) ? (int)$data['purchase_multiple'] : 1,
            'weight_per_unit' => isset($data['weight_per_unit']) ? (float)$data['weight_per_unit'] : 0,
            'is_active' => isset($data['is_active']) ? (bool)$data['is_active'] : true,
        ];

        // Handle category lookup
        if (!empty($data['category_code'])) {
            if (isset($categories[$data['category_code']])) {
                $materialData['category_id'] = $categories[$data['category_code']];
            } else {
                throw new \Exception("Categoria '{$data['category_code']}' não encontrada");
            }
        }

        // Handle supplier lookup
        if (!empty($data['supplier_name'])) {
            if (isset($suppliers[$data['supplier_name']])) {
                $materialData['supplier_id'] = $suppliers[$data['supplier_name']];
            } else {
                throw new \Exception("Fornecedor '{$data['supplier_name']}' não encontrado");
            }
        }

        return $materialData;
    }

    public function validateUnits()
    {
        $validUnits = [
            // Weight
            'g', 'kg', 't',
            // Volume
            'ml', 'l', 'm³',
            // Length
            'mm', 'cm', 'm', 'km',
            // Area
            'cm²', 'm²',
            // Count
            'un', 'pç', 'par', 'dz', 'cx',
            // Time
            'h', 'dia', 'sem', 'mês',
        ];

        return response()->json(['units' => $validUnits]);
    }
}