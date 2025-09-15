<?php

namespace Database\Seeders;

use App\Models\MaterialCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaterialCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Metais',
                'code' => 'METAL',
                'description' => 'Materiais metálicos diversos',
                'color' => '#6b7280',
                'icon' => '🔩',
                'parent_id' => null,
                'sort_order' => 1,
                'children' => [
                    [
                        'name' => 'Aço',
                        'code' => 'ACO',
                        'description' => 'Produtos de aço',
                        'color' => '#374151',
                        'icon' => '⚒️',
                        'sort_order' => 1,
                    ],
                    [
                        'name' => 'Alumínio',
                        'code' => 'ALUMINIO',
                        'description' => 'Produtos de alumínio',
                        'color' => '#9ca3af',
                        'icon' => '🔗',
                        'sort_order' => 2,
                    ],
                    [
                        'name' => 'Cobre',
                        'code' => 'COBRE',
                        'description' => 'Produtos de cobre',
                        'color' => '#92400e',
                        'icon' => '🟤',
                        'sort_order' => 3,
                    ],
                ]
            ],
            [
                'name' => 'Plásticos',
                'code' => 'PLASTICO',
                'description' => 'Materiais plásticos e polímeros',
                'color' => '#059669',
                'icon' => '🧪',
                'parent_id' => null,
                'sort_order' => 2,
                'children' => [
                    [
                        'name' => 'PVC',
                        'code' => 'PVC',
                        'description' => 'Policloreto de vinila',
                        'color' => '#047857',
                        'icon' => '🟢',
                        'sort_order' => 1,
                    ],
                    [
                        'name' => 'ABS',
                        'code' => 'ABS',
                        'description' => 'Acrilonitrila butadieno estireno',
                        'color' => '#065f46',
                        'icon' => '⚪',
                        'sort_order' => 2,
                    ],
                ]
            ],
            [
                'name' => 'Têxteis',
                'code' => 'TEXTIL',
                'description' => 'Materiais têxteis e tecidos',
                'color' => '#7c3aed',
                'icon' => '🧵',
                'parent_id' => null,
                'sort_order' => 3,
                'children' => [
                    [
                        'name' => 'Algodão',
                        'code' => 'ALGODAO',
                        'description' => 'Tecidos e materiais de algodão',
                        'color' => '#f3f4f6',
                        'icon' => '🤍',
                        'sort_order' => 1,
                    ],
                    [
                        'name' => 'Poliéster',
                        'code' => 'POLIESTER',
                        'description' => 'Tecidos de poliéster',
                        'color' => '#6d28d9',
                        'icon' => '🟣',
                        'sort_order' => 2,
                    ],
                ]
            ],
            [
                'name' => 'Eletrônicos',
                'code' => 'ELETRONICO',
                'description' => 'Componentes eletrônicos',
                'color' => '#dc2626',
                'icon' => '🔌',
                'parent_id' => null,
                'sort_order' => 4,
                'children' => [
                    [
                        'name' => 'Resistores',
                        'code' => 'RESISTOR',
                        'description' => 'Resistores eletrônicos',
                        'color' => '#991b1b',
                        'icon' => '🔴',
                        'sort_order' => 1,
                    ],
                    [
                        'name' => 'Capacitores',
                        'code' => 'CAPACITOR',
                        'description' => 'Capacitores eletrônicos',
                        'color' => '#b91c1c',
                        'icon' => '🟡',
                        'sort_order' => 2,
                    ],
                ]
            ],
            [
                'name' => 'Químicos',
                'code' => 'QUIMICO',
                'description' => 'Produtos químicos e reagentes',
                'color' => '#ea580c',
                'icon' => '⚗️',
                'parent_id' => null,
                'sort_order' => 5,
                'children' => [
                    [
                        'name' => 'Solventes',
                        'code' => 'SOLVENTE',
                        'description' => 'Solventes químicos',
                        'color' => '#c2410c',
                        'icon' => '🧪',
                        'sort_order' => 1,
                    ],
                    [
                        'name' => 'Ácidos',
                        'code' => 'ACIDO',
                        'description' => 'Ácidos diversos',
                        'color' => '#9a3412',
                        'icon' => '🟠',
                        'sort_order' => 2,
                    ],
                ]
            ],
            [
                'name' => 'Ferramentas',
                'code' => 'FERRAMENTA',
                'description' => 'Ferramentas e equipamentos',
                'color' => '#1f2937',
                'icon' => '🔧',
                'parent_id' => null,
                'sort_order' => 6,
            ],
            [
                'name' => 'Consumíveis',
                'code' => 'CONSUMIVEL',
                'description' => 'Materiais de consumo',
                'color' => '#0891b2',
                'icon' => '📦',
                'parent_id' => null,
                'sort_order' => 7,
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $category = MaterialCategory::create($categoryData);

            foreach ($children as $childData) {
                $childData['parent_id'] = $category->id;
                MaterialCategory::create($childData);
            }
        }
    }
}