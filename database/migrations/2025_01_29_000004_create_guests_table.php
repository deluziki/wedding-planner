<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('group')->nullable(); // family, friends, coworkers, etc.
            $table->string('side')->nullable(); // bride, groom, both
            $table->string('relationship')->nullable();
            $table->string('rsvp_status')->default('pending'); // pending, confirmed, declined, maybe
            $table->date('rsvp_date')->nullable();
            $table->boolean('attending_ceremony')->default(true);
            $table->boolean('attending_reception')->default(true);
            $table->integer('plus_one_allowed')->default(0);
            $table->integer('plus_one_count')->default(0);
            $table->string('plus_one_name')->nullable();
            $table->json('dietary_restrictions')->nullable();
            $table->string('meal_choice')->nullable();
            $table->text('special_requests')->nullable();
            $table->foreignId('table_id')->nullable();
            $table->integer('seat_number')->nullable();
            $table->boolean('is_child')->default(false);
            $table->integer('age')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
