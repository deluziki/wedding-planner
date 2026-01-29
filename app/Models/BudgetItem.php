<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'budget_category_id',
        'vendor_id',
        'name',
        'description',
        'estimated_cost',
        'actual_cost',
        'paid_amount',
        'payment_status',
        'due_date',
        'is_paid',
        'paid_date',
        'payment_method',
        'notes',
        'receipt',
        'priority',
    ];

    protected $casts = [
        'estimated_cost' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_date' => 'date',
        'is_paid' => 'boolean',
        'paid_date' => 'date',
        'priority' => 'integer',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BudgetCategory::class, 'budget_category_id');
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function getBalanceDueAttribute(): float
    {
        return ($this->actual_cost ?? $this->estimated_cost ?? 0) - ($this->paid_amount ?? 0);
    }

    public static function paymentStatuses(): array
    {
        return [
            'pending' => 'Pending',
            'partial' => 'Partially Paid',
            'paid' => 'Paid',
        ];
    }

    public static function paymentMethods(): array
    {
        return [
            'cash' => 'Cash',
            'check' => 'Check',
            'credit_card' => 'Credit Card',
            'debit_card' => 'Debit Card',
            'bank_transfer' => 'Bank Transfer',
            'paypal' => 'PayPal',
            'venmo' => 'Venmo',
            'other' => 'Other',
        ];
    }
}
