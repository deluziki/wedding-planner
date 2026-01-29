<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vendor_category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('company_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('status')->default('considering'); // considering, contacted, booked, declined, cancelled
            $table->decimal('quoted_price', 12, 2)->nullable();
            $table->decimal('final_price', 12, 2)->nullable();
            $table->decimal('deposit_amount', 12, 2)->nullable();
            $table->date('deposit_due_date')->nullable();
            $table->boolean('deposit_paid')->default(false);
            $table->decimal('balance_due', 12, 2)->nullable();
            $table->date('balance_due_date')->nullable();
            $table->boolean('balance_paid')->default(false);
            $table->date('contract_signed_date')->nullable();
            $table->string('contract_file')->nullable();
            $table->integer('rating')->nullable(); // 1-5
            $table->text('review')->nullable();
            $table->text('notes')->nullable();
            $table->json('services')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
