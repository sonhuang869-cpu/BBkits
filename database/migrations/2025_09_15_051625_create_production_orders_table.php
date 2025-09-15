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
        Schema::create('production_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->unsignedBigInteger('sale_id')->nullable();
            $table->string('product_name');
            $table->text('product_description')->nullable();
            $table->integer('quantity');
            $table->string('status')->default('pending'); // pending, in_progress, completed, cancelled
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->date('required_date')->nullable();
            $table->date('start_date')->nullable();
            $table->date('completion_date')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->text('notes')->nullable();
            $table->json('material_requirements')->nullable(); // Required materials with quantities
            $table->decimal('estimated_cost', 10, 2)->default(0);
            $table->decimal('actual_cost', 10, 2)->default(0);
            $table->timestamps();

            $table->foreign('sale_id')->references('id')->on('sales')->onDelete('set null');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');

            $table->index(['status', 'priority']);
            $table->index(['required_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_orders');
    }
};