<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('course')->nullable(); // appetizer, soup, salad, main, dessert
            $table->decimal('price_per_person', 10, 2)->nullable();
            $table->json('dietary_info')->nullable(); // vegetarian, vegan, gluten_free, etc.
            $table->json('allergens')->nullable();
            $table->boolean('is_available')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
