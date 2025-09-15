<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('set null');
            $table->foreign('secondary_supplier_id')->references('id')->on('suppliers')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->dropForeign(['supplier_id']);
            $table->dropForeign(['secondary_supplier_id']);
        });
    }
};