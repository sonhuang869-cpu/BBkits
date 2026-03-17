<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add invoice_id to sales table if it doesn't exist
        Schema::table('sales', function (Blueprint $table) {
            if (!Schema::hasColumn('sales', 'invoice_id')) {
                $table->unsignedBigInteger('invoice_id')->nullable()->after('tiny_erp_sync_at');
            }
        });

        // Add foreign key constraint after invoices table exists
        if (Schema::hasTable('invoices') && Schema::hasColumn('sales', 'invoice_id')) {
            Schema::table('sales', function (Blueprint $table) {
                $table->foreign('invoice_id')->references('id')->on('invoices')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            if (Schema::hasColumn('sales', 'invoice_id')) {
                $table->dropForeign(['invoice_id']);
                $table->dropColumn('invoice_id');
            }
        });
    }
};
