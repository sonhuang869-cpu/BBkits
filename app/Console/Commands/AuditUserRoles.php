<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AuditUserRoles extends Command
{
    protected $signature = 'users:audit-roles {--fix : Actually fix the issues found}';
    protected $description = 'Audit user roles and fix unauthorized admin accounts (BUG-A01)';

    public function handle()
    {
        $this->info('=== User Role Audit ===');
        $this->newLine();

        // List all admin users
        $admins = User::where('role', 'admin')->get();
        $this->info("Admin users found: {$admins->count()}");

        foreach ($admins as $admin) {
            $this->line("  ID: {$admin->id}, Email: {$admin->email}, Name: {$admin->name}");
        }

        $this->newLine();

        // Known legitimate admin emails (add your actual admin emails here)
        $legitimateAdminEmails = [
            'admin@bbkits.com',
            'bruna@bbkits.com',
            // Add other legitimate admin emails
        ];

        // Find unauthorized admins
        $unauthorizedAdmins = User::where('role', 'admin')
            ->whereNotIn('email', $legitimateAdminEmails)
            ->get();

        if ($unauthorizedAdmins->count() > 0) {
            $this->warn("Unauthorized admin accounts found: {$unauthorizedAdmins->count()}");

            foreach ($unauthorizedAdmins as $user) {
                $this->error("  UNAUTHORIZED: ID={$user->id}, Email={$user->email}, Name={$user->name}");

                if ($this->option('fix')) {
                    $user->role = 'vendedora';
                    $user->save();
                    $this->info("    -> Changed role to 'vendedora'");
                }
            }

            if (!$this->option('fix')) {
                $this->newLine();
                $this->warn("Run with --fix to change unauthorized admins to 'vendedora' role");
            }
        } else {
            $this->info("No unauthorized admin accounts found.");
        }

        // Specifically check user 26 (from QA report)
        $this->newLine();
        $user26 = User::find(26);
        if ($user26) {
            $this->info("User 26 check:");
            $this->line("  Email: {$user26->email}");
            $this->line("  Role: {$user26->role}");

            if ($user26->role === 'admin' && !in_array($user26->email, $legitimateAdminEmails)) {
                $this->error("  STATUS: UNAUTHORIZED ADMIN!");

                if ($this->option('fix')) {
                    $user26->role = 'vendedora';
                    $user26->save();
                    $this->info("  -> Fixed: Changed to 'vendedora'");
                }
            } else {
                $this->info("  STATUS: OK");
            }
        } else {
            $this->info("User 26 not found in database.");
        }

        $this->newLine();
        $this->info('=== Audit Complete ===');

        return Command::SUCCESS;
    }
}
