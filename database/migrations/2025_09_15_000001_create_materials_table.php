<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 20)->unique()->comment('Internal ID like CR20, RS25, OF32');
            $table->string('name')->comment('Material name like "Synthetic Laminated"');
            $table->enum('unit', ['m', 'cm', 'g', 'unit', 'pair', 'roll', 'kg'])->comment('Unit of measure');
            $table->decimal('purchase_price', 10, 2)->comment('Average purchase price');
            $table->unsignedBigInteger('supplier_id')->nullable()->comment('Main supplier');
            $table->unsignedBigInteger('secondary_supplier_id')->nullable()->comment('Secondary supplier');
            $table->integer('lead_time_days')->default(0)->comment('Delivery time in days');
            $table->decimal('current_stock', 10, 3)->default(0)->comment('Current inventory level');
            $table->decimal('minimum_stock', 10, 3)->default(0)->comment('Minimum stock for alerts');
            $table->integer('purchase_multiple')->default(1)->comment('Pack size (100 units, etc.)');
            $table->decimal('weight_per_unit', 8, 3)->nullable()->comment('Weight or volume per unit');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Indexes for performance
            $table->index('reference');
            $table->index('current_stock');
            $table->index('minimum_stock');
            $table->index(['is_active', 'current_stock']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('materials');
    }
};