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
        Schema::table('materials', function (Blueprint $table) {
            $table->string('external_id')->nullable()->unique()->after('id');
            $table->index('external_id');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('external_id')->nullable()->unique()->after('id');
            $table->index('external_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->dropIndex(['external_id']);
            $table->dropColumn('external_id');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropIndex(['external_id']);
            $table->dropColumn('external_id');
        });
    }
};
