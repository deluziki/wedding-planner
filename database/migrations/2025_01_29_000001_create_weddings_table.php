<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weddings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('bride_name');
            $table->string('groom_name');
            $table->date('wedding_date')->nullable();
            $table->time('ceremony_time')->nullable();
            $table->time('reception_time')->nullable();
            $table->string('wedding_style')->nullable(); // traditional, modern, rustic, beach, etc.
            $table->string('color_scheme')->nullable();
            $table->text('theme_description')->nullable();
            $table->string('status')->default('planning'); // planning, confirmed, completed, cancelled
            $table->decimal('total_budget', 12, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->string('cover_image')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weddings');
    }
};
