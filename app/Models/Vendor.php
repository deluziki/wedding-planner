<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'vendor_category_id',
        'name',
        'company_name',
        'email',
        'phone',
        'website',
        'address',
        'city',
        'state',
        'country',
        'status',
        'quoted_price',
        'final_price',
        'deposit_amount',
        'deposit_due_date',
        'deposit_paid',
        'balance_due',
        'balance_due_date',
        'balance_paid',
        'contract_signed_date',
        'contract_file',
        'rating',
        'review',
        'notes',
        'services',
        'images',
    ];

    protected $casts = [
        'quoted_price' => 'decimal:2',
        'final_price' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'deposit_due_date' => 'date',
        'deposit_paid' => 'boolean',
        'balance_due' => 'decimal:2',
        'balance_due_date' => 'date',
        'balance_paid' => 'boolean',
        'contract_signed_date' => 'date',
        'rating' => 'integer',
        'services' => 'array',
        'images' => 'array',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(VendorCategory::class, 'vendor_category_id');
    }

    public function budgetItems(): HasMany
    {
        return $this->hasMany(BudgetItem::class);
    }

    public function timelineEvents(): HasMany
    {
        return $this->hasMany(TimelineEvent::class);
    }

    public function getTotalPaidAttribute(): float
    {
        $total = 0;
        if ($this->deposit_paid) {
            $total += $this->deposit_amount ?? 0;
        }
        if ($this->balance_paid) {
            $total += $this->balance_due ?? 0;
        }
        return $total;
    }

    public function getAmountOwedAttribute(): float
    {
        return ($this->final_price ?? 0) - $this->total_paid;
    }

    public static function statuses(): array
    {
        return [
            'considering' => 'Considering',
            'contacted' => 'Contacted',
            'booked' => 'Booked',
            'declined' => 'Declined',
            'cancelled' => 'Cancelled',
        ];
    }
}
