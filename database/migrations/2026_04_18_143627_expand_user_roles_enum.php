<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Fix BUG-01 and BUG-06: Expand role column to support all user types.
     * Changed from enum to string for better compatibility and flexibility.
     */
    public function up(): void
    {
        // For PostgreSQL, we need to handle enum differently
        // Convert enum to varchar for flexibility

        if (DB::getDriverName() === 'pgsql') {
            // PostgreSQL: Change column type from enum to varchar
            DB::statement('ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50)');
        } else {
            // MySQL: Modify enum to include all roles
            DB::statement("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'vendedora'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Note: Reverting to enum may fail if there are values not in the original enum
        // This is intentionally left as VARCHAR for safety
    }
};
