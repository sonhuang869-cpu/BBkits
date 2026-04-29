<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * BUG-N02: Create login_attempts table for rate limiting.
 * Uses database storage instead of cache for reliable persistence.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Skip if table already exists (idempotent migration)
        if (Schema::hasTable('login_attempts')) {
            return;
        }

        Schema::create('login_attempts', function (Blueprint $table) {
            $table->id();
            $table->string('key', 64)->index();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('login_attempts');
    }
};
