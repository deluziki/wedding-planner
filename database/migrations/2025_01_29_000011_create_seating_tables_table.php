<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seating_tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // Table 1, Head Table, etc.
            $table->string('shape')->default('round'); // round, rectangular, square, oval
            $table->integer('capacity');
            $table->string('location')->nullable(); // near stage, by window, etc.
            $table->decimal('position_x', 8, 2)->nullable(); // for visual chart
            $table->decimal('position_y', 8, 2)->nullable();
            $table->text('notes')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Add foreign key to guests table
        Schema::table('guests', function (Blueprint $table) {
            $table->foreign('table_id')->references('id')->on('seating_tables')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->dropForeign(['table_id']);
        });
        Schema::dropIfExists('seating_tables');
    }
};
