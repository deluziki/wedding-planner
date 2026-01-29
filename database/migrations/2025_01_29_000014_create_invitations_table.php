<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();
            $table->foreignId('guest_id')->constrained()->cascadeOnDelete();
            $table->string('type')->default('formal'); // formal, save_the_date, rehearsal_dinner, etc.
            $table->string('delivery_method')->default('mail'); // mail, email, hand_delivered
            $table->string('status')->default('pending'); // pending, sent, delivered, returned
            $table->date('sent_date')->nullable();
            $table->date('delivered_date')->nullable();
            $table->string('tracking_number')->nullable();
            $table->text('address_used')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
