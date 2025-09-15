<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved', 'admin']);
    }

    public function index()
    {
        $users = User::orderBy('name')->get();

        $permissionMatrix = [];

        foreach ($users as $user) {
            $permissionMatrix[] = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'approved' => $user->isApproved(),
                ],
                'materials' => [
                    'view' => $user->canViewMaterials(),
                    'edit' => $user->canEditMaterials(),
                    'manage' => $user->canManageMaterials(),
                    'delete' => $user->canDeleteMaterials(),
                ],
                'suppliers' => [
                    'view' => $user->canViewSuppliers(),
                    'edit' => $user->canEditSuppliers(),
                    'manage' => $user->canManageSuppliers(),
                    'delete' => $user->canDeleteSuppliers(),
                ],
                'inventory' => [
                    'view' => $user->canViewInventoryTransactions(),
                    'create' => $user->canCreateInventoryTransactions(),
                    'adjust' => $user->canAdjustStock(),
                    'bulk' => $user->canBulkAdjustInventory(),
                    'manage' => $user->canManageInventory(),
                ],
            ];
        }

        $roleDefinitions = [
            'admin' => [
                'name' => 'Administrador',
                'description' => 'Acesso total ao sistema de materiais',
                'materials' => ['view', 'edit', 'manage', 'delete'],
                'suppliers' => ['view', 'edit', 'manage', 'delete'],
                'inventory' => ['view', 'create', 'adjust', 'bulk', 'manage'],
            ],
            'manager' => [
                'name' => 'Gerente',
                'description' => 'Gestão completa de materiais e estoque',
                'materials' => ['view', 'edit', 'manage'],
                'suppliers' => ['view', 'edit', 'manage'],
                'inventory' => ['view', 'create', 'adjust', 'bulk', 'manage'],
            ],
            'production_admin' => [
                'name' => 'Admin de Produção',
                'description' => 'Gerenciamento de estoque e materiais para produção',
                'materials' => ['view', 'edit'],
                'suppliers' => ['view', 'edit'],
                'inventory' => ['view', 'create', 'adjust'],
            ],
            'finance_admin' => [
                'name' => 'Admin Financeiro',
                'description' => 'Visualização de materiais e estoque para controle financeiro',
                'materials' => ['view'],
                'suppliers' => ['view'],
                'inventory' => ['view'],
            ],
            'financeiro' => [
                'name' => 'Financeiro',
                'description' => 'Visualização de materiais e estoque',
                'materials' => ['view'],
                'suppliers' => ['view'],
                'inventory' => ['view'],
            ],
            'vendedora' => [
                'name' => 'Vendedora',
                'description' => 'Sem acesso ao sistema de materiais',
                'materials' => [],
                'suppliers' => [],
                'inventory' => [],
            ],
        ];

        $permissionDescriptions = [
            'materials' => [
                'view' => 'Visualizar lista e detalhes dos materiais',
                'edit' => 'Criar, editar e ajustar estoque de materiais',
                'manage' => 'Gestão completa de materiais',
                'delete' => 'Remover materiais do sistema',
            ],
            'suppliers' => [
                'view' => 'Visualizar lista e detalhes dos fornecedores',
                'edit' => 'Criar e editar fornecedores',
                'manage' => 'Gestão completa de fornecedores',
                'delete' => 'Remover fornecedores do sistema',
            ],
            'inventory' => [
                'view' => 'Visualizar transações de estoque',
                'create' => 'Criar novas transações de estoque',
                'adjust' => 'Fazer ajustes de estoque',
                'bulk' => 'Realizar ajustes de estoque em lote',
                'manage' => 'Gestão completa do inventário',
            ],
        ];

        return Inertia::render('Admin/Permissions/Index', [
            'permissionMatrix' => $permissionMatrix,
            'roleDefinitions' => $roleDefinitions,
            'permissionDescriptions' => $permissionDescriptions,
        ]);
    }

    public function rolePermissions($role)
    {
        $user = new User(['role' => $role]);

        return response()->json([
            'role' => $role,
            'permissions' => [
                'materials' => [
                    'view' => $user->canViewMaterials(),
                    'edit' => $user->canEditMaterials(),
                    'manage' => $user->canManageMaterials(),
                    'delete' => $user->canDeleteMaterials(),
                ],
                'suppliers' => [
                    'view' => $user->canViewSuppliers(),
                    'edit' => $user->canEditSuppliers(),
                    'manage' => $user->canManageSuppliers(),
                    'delete' => $user->canDeleteSuppliers(),
                ],
                'inventory' => [
                    'view' => $user->canViewInventoryTransactions(),
                    'create' => $user->canCreateInventoryTransactions(),
                    'adjust' => $user->canAdjustStock(),
                    'bulk' => $user->canBulkAdjustInventory(),
                    'manage' => $user->canManageInventory(),
                ],
            ],
        ]);
    }
}