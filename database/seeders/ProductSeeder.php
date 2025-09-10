<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductCategory;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ProductCategory::all();
        
        $products = [
            // Bolsas
            [
                'category_id' => $categories->where('name', 'Bolsas')->first()->id,
                'name' => 'Bolsa Térmica Infantil',
                'description' => 'Bolsa térmica para manter lanche fresquinho',
                'price' => 89.90,
                'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
                'allows_embroidery' => true,
                'available_sizes' => ['P', 'M', 'G'],
                'available_colors' => ['Rosa', 'Azul', 'Verde'],
                'is_active' => true,
                'stock_quantity' => 50,
            ],
            [
                'category_id' => $categories->where('name', 'Bolsas')->first()->id,
                'name' => 'Bolsa de Fraldas Premium',
                'description' => 'Bolsa espaçosa para todas as necessidades do bebê',
                'price' => 149.90,
                'image_url' => 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop',
                'allows_embroidery' => true,
                'available_sizes' => ['M', 'G', 'GG'],
                'available_colors' => ['Bege', 'Rosa', 'Azul'],
                'is_active' => true,
                'stock_quantity' => 30,
            ],
            
            // Mochilas
            [
                'category_id' => $categories->where('name', 'Mochilas')->first()->id,
                'name' => 'Mochila Escolar Unicórnio',
                'description' => 'Mochila colorida com tema de unicórnio',
                'price' => 119.90,
                'image_url' => 'https://images.unsplash.com/photo-1582017334482-4c4b9c4c4e87?w=300&h=200&fit=crop',
                'allows_embroidery' => true,
                'available_sizes' => ['P', 'M'],
                'available_colors' => ['Rosa', 'Lilás', 'Branco'],
                'is_active' => true,
                'stock_quantity' => 25,
            ],
            [
                'category_id' => $categories->where('name', 'Mochilas')->first()->id,
                'name' => 'Mochila Aventura',
                'description' => 'Mochila resistente para atividades ao ar livre',
                'price' => 99.90,
                'image_url' => 'https://images.unsplash.com/photo-1582017334482-4c4b9c4c4e87?w=300&h=200&fit=crop',
                'allows_embroidery' => true,
                'available_sizes' => ['M', 'G'],
                'available_colors' => ['Verde', 'Azul', 'Vermelho'],
                'is_active' => true,
                'stock_quantity' => 40,
            ],
            
            // Malas
            [
                'category_id' => $categories->where('name', 'Malas')->first()->id,
                'name' => 'Mala de Rodinha Infantil',
                'description' => 'Mala com rodinhas para viagens das crianças',
                'price' => 199.90,
                'image_url' => 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=300&h=200&fit=crop',
                'allows_embroidery' => true,
                'available_sizes' => ['M', 'G'],
                'available_colors' => ['Amarelo', 'Rosa', 'Azul'],
                'is_active' => true,
                'stock_quantity' => 15,
            ],
            
            // Acessórios
            [
                'category_id' => $categories->where('name', 'Acessórios')->first()->id,
                'name' => 'Kit Necessaire Infantil',
                'description' => 'Conjunto de necessaires para organização',
                'price' => 59.90,
                'image_url' => 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=300&h=200&fit=crop',
                'allows_embroidery' => true,
                'available_sizes' => ['P', 'M'],
                'available_colors' => ['Rosa', 'Azul', 'Verde', 'Amarelo'],
                'is_active' => true,
                'stock_quantity' => 60,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}