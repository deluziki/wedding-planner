<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();
            $table->string('hotel_name');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('booking_code')->nullable(); // group discount code
            $table->decimal('rate_per_night', 10, 2)->nullable();
            $table->date('block_start_date')->nullable();
            $table->date('block_end_date')->nullable();
            $table->date('booking_deadline')->nullable();
            $table->integer('rooms_blocked')->nullable();
            $table->integer('rooms_booked')->default(0);
            $table->string('distance_to_venue')->nullable();
            $table->text('amenities')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};
