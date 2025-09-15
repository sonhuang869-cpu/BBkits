<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['purchase', 'consumption', 'adjustment', 'return']);
            $table->decimal('quantity', 10, 3)->comment('Positive for inbound, negative for outbound');
            $table->decimal('unit_cost', 10, 2)->nullable()->comment('Cost per unit for purchases');
            $table->string('reference')->nullable()->comment('Order number, adjustment reason, etc.');
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->constrained()->comment('Who made the transaction');
            $table->timestamps();

            $table->index(['material_id', 'created_at']);
            $table->index('type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('inventory_transactions');
    }
};