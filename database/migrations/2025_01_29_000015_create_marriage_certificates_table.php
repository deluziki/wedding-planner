<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marriage_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();
            $table->string('certificate_number')->nullable();
            $table->string('license_number')->nullable();
            $table->date('license_issue_date')->nullable();
            $table->date('license_expiry_date')->nullable();
            $table->string('issuing_authority')->nullable();
            $table->string('issuing_location')->nullable();
            $table->string('bride_legal_name');
            $table->string('groom_legal_name');
            $table->date('marriage_date')->nullable();
            $table->string('marriage_location')->nullable();
            $table->string('officiant_name')->nullable();
            $table->string('officiant_title')->nullable();
            $table->string('witness_1_name')->nullable();
            $table->string('witness_2_name')->nullable();
            $table->string('status')->default('pending'); // pending, applied, received, filed
            $table->date('application_date')->nullable();
            $table->date('received_date')->nullable();
            $table->decimal('fee', 8, 2)->nullable();
            $table->boolean('fee_paid')->default(false);
            $table->string('certificate_file')->nullable();
            $table->string('license_file')->nullable();
            $table->text('notes')->nullable();
            $table->json('requirements_checklist')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marriage_certificates');
    }
};
