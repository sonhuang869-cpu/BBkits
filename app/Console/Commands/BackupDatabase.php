<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'backup:database {--keep=7 : Number of backups to keep}';

    /**
     * The console command description.
     */
    protected $description = 'Create a backup of the database and clean old backups';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $keepBackups = $this->option('keep');
        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $backupFileName = "bbkits_backup_{$timestamp}.sql";
        $backupPath = storage_path("app/backups/{$backupFileName}");

        // Create backups directory if it doesn't exist
        if (!Storage::disk('local')->exists('backups')) {
            Storage::disk('local')->makeDirectory('backups');
        }

        $this->info("Starting database backup...");

        // Get database configuration
        $database = config('database.default');
        $connection = config("database.connections.{$database}");

        try {
            if ($database === 'sqlite') {
                $this->backupSqlite($connection, $backupPath);
            } elseif ($database === 'mysql') {
                $this->backupMysql($connection, $backupPath);
            } elseif ($database === 'pgsql') {
                $this->backupPostgresql($connection, $backupPath);
            } else {
                $this->error("Unsupported database type: {$database}");
                return 1;
            }

            $this->info("✅ Database backup created: {$backupFileName}");
            $this->info("📂 Location: {$backupPath}");

            // Clean old backups
            $this->cleanOldBackups($keepBackups);

            // Create backup metadata
            $this->createBackupMetadata($backupFileName);

        } catch (\Exception $e) {
            $this->error("❌ Backup failed: {$e->getMessage()}");
            return 1;
        }

        return 0;
    }

    private function backupSqlite($connection, $backupPath)
    {
        $databasePath = $connection['database'];
        
        if (!file_exists($databasePath)) {
            throw new \Exception("SQLite database file not found: {$databasePath}");
        }

        // For SQLite, we can simply copy the database file
        if (!copy($databasePath, $backupPath)) {
            throw new \Exception("Failed to copy SQLite database");
        }

        // Also create a SQL dump for portability
        // SECURITY FIX: Use escapeshellarg() to prevent command injection
        $sqlBackupPath = str_replace('.sql', '_dump.sql', $backupPath);
        $command = sprintf(
            'sqlite3 %s .dump > %s',
            escapeshellarg($databasePath),
            escapeshellarg($sqlBackupPath)
        );

        exec($command, $output, $returnCode);
        
        if ($returnCode !== 0) {
            $this->warn("SQLite dump creation failed, but database copy succeeded");
        }
    }

    private function backupMysql($connection, $backupPath)
    {
        $host = $connection['host'] ?? 'localhost';
        $port = $connection['port'] ?? '3306';
        $database = $connection['database'];
        $username = $connection['username'];
        $password = $connection['password'];

        $command = sprintf(
            'mysqldump --host=%s --port=%s --user=%s --password=%s --single-transaction --routines --triggers %s > %s',
            escapeshellarg($host),
            escapeshellarg($port),
            escapeshellarg($username),
            escapeshellarg($password),
            escapeshellarg($database),
            escapeshellarg($backupPath)
        );

        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            throw new \Exception("MySQL backup failed with return code: {$returnCode}");
        }
    }

    private function backupPostgresql($connection, $backupPath)
    {
        $host = $connection['host'] ?? 'localhost';
        $port = $connection['port'] ?? '5432';
        $database = $connection['database'];
        $username = $connection['username'];
        $password = $connection['password'];

        // Set password via environment variable for pg_dump
        putenv("PGPASSWORD={$password}");

        $command = sprintf(
            'pg_dump --host=%s --port=%s --username=%s --dbname=%s --no-password --clean --create > %s',
            escapeshellarg($host),
            escapeshellarg($port),
            escapeshellarg($username),
            escapeshellarg($database),
            escapeshellarg($backupPath)
        );

        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            throw new \Exception("PostgreSQL backup failed with return code: {$returnCode}");
        }
    }

    private function cleanOldBackups($keepBackups)
    {
        $this->info("Cleaning old backups (keeping {$keepBackups} most recent)...");

        $backupFiles = collect(Storage::disk('local')->files('backups'))
            ->filter(function ($file) {
                return str_starts_with(basename($file), 'bbkits_backup_') && 
                       (str_ends_with($file, '.sql') || str_ends_with($file, '.db'));
            })
            ->map(function ($file) {
                return [
                    'path' => $file,
                    'timestamp' => Storage::disk('local')->lastModified($file)
                ];
            })
            ->sortByDesc('timestamp')
            ->values();

        if ($backupFiles->count() <= $keepBackups) {
            $this->info("✅ No old backups to clean (found {$backupFiles->count()} backups)");
            return;
        }

        $filesToDelete = $backupFiles->slice($keepBackups);

        foreach ($filesToDelete as $file) {
            try {
                Storage::disk('local')->delete($file['path']);
                $this->info("🗑️ Deleted old backup: " . basename($file['path']));
            } catch (\Exception $e) {
                $this->warn("Failed to delete backup {$file['path']}: {$e->getMessage()}");
            }
        }

        $this->info("✅ Cleaned {$filesToDelete->count()} old backups");
    }

    private function createBackupMetadata($backupFileName)
    {
        $metadata = [
            'filename' => $backupFileName,
            'created_at' => Carbon::now()->toISOString(),
            'database_type' => config('database.default'),
            'laravel_version' => app()->version(),
            'app_version' => config('app.version', '1.0.0'),
            'file_size' => Storage::disk('local')->size("backups/{$backupFileName}"),
            'tables_count' => $this->getTablesCount(),
            'records_count' => $this->getRecordsCount()
        ];

        $metadataFile = "backups/" . str_replace('.sql', '_metadata.json', $backupFileName);
        Storage::disk('local')->put($metadataFile, json_encode($metadata, JSON_PRETTY_PRINT));

        $this->info("📊 Backup metadata saved: {$metadataFile}");
    }

    private function getTablesCount()
    {
        try {
            $database = config('database.default');
            
            if ($database === 'sqlite') {
                return \DB::select("SELECT count(*) as count FROM sqlite_master WHERE type='table'")[0]->count;
            } elseif ($database === 'mysql') {
                return count(\DB::select('SHOW TABLES'));
            } elseif ($database === 'pgsql') {
                return \DB::select("SELECT count(*) as count FROM information_schema.tables WHERE table_schema='public'")[0]->count;
            }
            
            return 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    private function getRecordsCount()
    {
        try {
            $totalRecords = 0;
            $tables = ['users', 'sales', 'order_comments', 'notifications', 'commission_ranges'];
            
            foreach ($tables as $table) {
                try {
                    $count = \DB::table($table)->count();
                    $totalRecords += $count;
                } catch (\Exception $e) {
                    // Table might not exist, skip it
                }
            }
            
            return $totalRecords;
        } catch (\Exception $e) {
            return 0;
        }
    }
}