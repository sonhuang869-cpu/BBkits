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
            $table->unsignedBigInteger('category_id')->nullable()->after('supplier_id');
            $table->string('image_path')->nullable()->after('description');
            $table->json('unit_conversions')->nullable()->after('unit');

            $table->foreign('category_id')->references('id')->on('material_categories')->onDelete('set null');
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropIndex(['category_id']);
            $table->dropColumn(['category_id', 'image_path', 'unit_conversions']);
        });
    }
};