<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarriageCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'certificate_number',
        'license_number',
        'license_issue_date',
        'license_expiry_date',
        'issuing_authority',
        'issuing_location',
        'bride_legal_name',
        'groom_legal_name',
        'marriage_date',
        'marriage_location',
        'officiant_name',
        'officiant_title',
        'witness_1_name',
        'witness_2_name',
        'status',
        'application_date',
        'received_date',
        'fee',
        'fee_paid',
        'certificate_file',
        'license_file',
        'notes',
        'requirements_checklist',
    ];

    protected $casts = [
        'license_issue_date' => 'date',
        'license_expiry_date' => 'date',
        'marriage_date' => 'date',
        'application_date' => 'date',
        'received_date' => 'date',
        'fee' => 'decimal:2',
        'fee_paid' => 'boolean',
        'requirements_checklist' => 'array',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function getIsLicenseValidAttribute(): bool
    {
        if (!$this->license_expiry_date) {
            return false;
        }
        return $this->license_expiry_date->isFuture();
    }

    public static function statuses(): array
    {
        return [
            'pending' => 'Pending',
            'applied' => 'Applied',
            'received' => 'License Received',
            'filed' => 'Certificate Filed',
        ];
    }

    public static function defaultRequirements(): array
    {
        return [
            ['item' => 'Valid government-issued ID (both parties)', 'completed' => false],
            ['item' => 'Birth certificates', 'completed' => false],
            ['item' => 'Social Security numbers', 'completed' => false],
            ['item' => 'Proof of address', 'completed' => false],
            ['item' => 'Divorce decree (if applicable)', 'completed' => false],
            ['item' => 'Death certificate of former spouse (if applicable)', 'completed' => false],
            ['item' => 'Parental consent (if under 18)', 'completed' => false],
            ['item' => 'Blood test results (if required by state)', 'completed' => false],
            ['item' => 'Application fee payment', 'completed' => false],
            ['item' => 'Waiting period completed', 'completed' => false],
        ];
    }
}
