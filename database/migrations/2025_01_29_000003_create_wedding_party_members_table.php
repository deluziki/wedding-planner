<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wedding_party_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('role'); // maid_of_honor, best_man, bridesmaid, groomsman, flower_girl, ring_bearer, officiant, etc.
            $table->string('side'); // bride, groom
            $table->string('relationship')->nullable(); // sister, brother, friend, cousin, etc.
            $table->text('responsibilities')->nullable();
            $table->string('attire_status')->default('pending'); // pending, ordered, fitted, ready
            $table->string('attire_details')->nullable();
            $table->decimal('attire_cost', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->string('photo')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wedding_party_members');
    }
};
