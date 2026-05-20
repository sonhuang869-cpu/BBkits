<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // SECURITY FIX H-02: Role removed from $fillable, must be set explicitly
        // Create Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@bbkits.com'],
            [
                'name' => 'Administrador BBKits',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
            ]
        );
        $admin->setRole('admin');
        $admin->save();

        // Create Finance User
        $financeiro = User::updateOrCreate(
            ['email' => 'financeiro@bbkits.com'],
            [
                'name' => 'Financeiro BBKits',
                'email_verified_at' => now(),
                'password' => Hash::make('financeiro123'),
            ]
        );
        $financeiro->setRole('financeiro');
        $financeiro->save();

        // Create Sales Users (Vendedoras)
        $vendedoras = [
            ['name' => 'Maria Silva', 'email' => 'maria@bbkits.com'],
            ['name' => 'Ana Santos', 'email' => 'ana@bbkits.com'],
            ['name' => 'Juliana Costa', 'email' => 'juliana@bbkits.com'],
            ['name' => 'Carla Oliveira', 'email' => 'carla@bbkits.com'],
            ['name' => 'Patricia Lima', 'email' => 'patricia@bbkits.com'],
        ];

        foreach ($vendedoras as $vendedora) {
            $user = User::updateOrCreate(
                ['email' => $vendedora['email']],
                [
                    'name' => $vendedora['name'],
                    'email_verified_at' => now(),
                    'password' => Hash::make('vendedora123'),
                ]
            );
            $user->setRole('vendedora');
            $user->save();
        }

        $this->command->info('Users created or updated successfully!');
        $this->command->info('Admin: admin@bbkits.com / admin123');
        $this->command->info('Financeiro: financeiro@bbkits.com / financeiro123');
        $this->command->info('Vendedoras: maria@bbkits.com, ana@bbkits.com, etc. / vendedora123');
    }
}