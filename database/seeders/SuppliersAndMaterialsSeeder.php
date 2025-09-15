<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Supplier;
use App\Models\Material;

class SuppliersAndMaterialsSeeder extends Seeder
{
    public function run(): void
    {
        // Create sample suppliers
        $suppliers = [
            [
                'name' => 'Fornecedor ABC Ltda',
                'contact_name' => 'João Silva',
                'email' => 'joao@abc.com.br',
                'phone' => '(11) 99999-1111',
                'address' => 'Rua das Flores, 123 - São Paulo/SP',
                'payment_terms' => '30/60 dias',
                'is_active' => true,
            ],
            [
                'name' => 'Materiais XYZ',
                'contact_name' => 'Maria Santos',
                'email' => 'maria@xyz.com.br',
                'phone' => '(11) 99999-2222',
                'address' => 'Av. Industrial, 456 - São Paulo/SP',
                'payment_terms' => 'À vista com 5% desconto',
                'is_active' => true,
            ],
            [
                'name' => 'Distribuidora Nacional',
                'contact_name' => 'Carlos Oliveira',
                'email' => 'carlos@nacional.com.br',
                'phone' => '(11) 99999-3333',
                'address' => 'Rod. Nacional, Km 15 - Guarulhos/SP',
                'payment_terms' => '45 dias',
                'is_active' => true,
            ]
        ];

        foreach ($suppliers as $supplierData) {
            Supplier::create($supplierData);
        }

        // Get created suppliers
        $supplier1 = Supplier::where('name', 'Fornecedor ABC Ltda')->first();
        $supplier2 = Supplier::where('name', 'Materiais XYZ')->first();
        $supplier3 = Supplier::where('name', 'Distribuidora Nacional')->first();

        // Create sample materials
        $materials = [
            [
                'reference' => 'CR20',
                'name' => 'Laminado Sintético Cristal 20cm',
                'unit' => 'm',
                'purchase_price' => 12.50,
                'supplier_id' => $supplier1->id,
                'secondary_supplier_id' => $supplier2->id,
                'lead_time_days' => 5,
                'current_stock' => 150.500,
                'minimum_stock' => 50.000,
                'purchase_multiple' => 10,
                'weight_per_unit' => 0.250,
                'is_active' => true,
            ],
            [
                'reference' => 'RS25',
                'name' => 'Gorgorão Rosa 25mm',
                'unit' => 'm',
                'purchase_price' => 8.75,
                'supplier_id' => $supplier2->id,
                'lead_time_days' => 3,
                'current_stock' => 25.000, // Low stock
                'minimum_stock' => 100.000,
                'purchase_multiple' => 50,
                'weight_per_unit' => 0.015,
                'is_active' => true,
            ],
            [
                'reference' => 'OF32',
                'name' => 'Olho de Falcão 32mm',
                'unit' => 'unit',
                'purchase_price' => 0.25,
                'supplier_id' => $supplier1->id,
                'secondary_supplier_id' => $supplier3->id,
                'lead_time_days' => 7,
                'current_stock' => 0, // Out of stock
                'minimum_stock' => 500,
                'purchase_multiple' => 100,
                'weight_per_unit' => 0.005,
                'is_active' => true,
            ],
            [
                'reference' => 'ZP15',
                'name' => 'Zíper Preto 15cm',
                'unit' => 'unit',
                'purchase_price' => 1.50,
                'supplier_id' => $supplier3->id,
                'lead_time_days' => 10,
                'current_stock' => 750,
                'minimum_stock' => 200,
                'purchase_multiple' => 25,
                'weight_per_unit' => 0.008,
                'is_active' => true,
            ],
            [
                'reference' => 'FC12',
                'name' => 'Fita Cetim 12mm Branca',
                'unit' => 'm',
                'purchase_price' => 3.20,
                'supplier_id' => $supplier2->id,
                'lead_time_days' => 4,
                'current_stock' => 320.750,
                'minimum_stock' => 100.000,
                'purchase_multiple' => 20,
                'weight_per_unit' => 0.003,
                'is_active' => true,
            ],
            [
                'reference' => 'BR08',
                'name' => 'Botão Redondo 8mm',
                'unit' => 'unit',
                'purchase_price' => 0.15,
                'supplier_id' => $supplier1->id,
                'lead_time_days' => 6,
                'current_stock' => 2500,
                'minimum_stock' => 1000,
                'purchase_multiple' => 500,
                'weight_per_unit' => 0.001,
                'is_active' => true,
            ]
        ];

        foreach ($materials as $materialData) {
            Material::create($materialData);
        }
    }
}