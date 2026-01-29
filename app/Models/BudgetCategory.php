<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'name',
        'icon',
        'estimated_amount',
        'actual_amount',
        'percentage',
        'notes',
        'order',
    ];

    protected $casts = [
        'estimated_amount' => 'decimal:2',
        'actual_amount' => 'decimal:2',
        'percentage' => 'integer',
        'order' => 'integer',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BudgetItem::class);
    }

    public function getActualTotalAttribute(): float
    {
        return $this->items()->sum('actual_cost');
    }

    public function getEstimatedTotalAttribute(): float
    {
        return $this->items()->sum('estimated_cost');
    }

    public function getPaidTotalAttribute(): float
    {
        return $this->items()->sum('paid_amount');
    }

    public static function defaultCategories(): array
    {
        return [
            ['name' => 'Venue', 'icon' => 'building', 'percentage' => 30, 'order' => 1],
            ['name' => 'Catering', 'icon' => 'utensils', 'percentage' => 25, 'order' => 2],
            ['name' => 'Photography & Videography', 'icon' => 'camera', 'percentage' => 12, 'order' => 3],
            ['name' => 'Music & Entertainment', 'icon' => 'music', 'percentage' => 8, 'order' => 4],
            ['name' => 'Flowers & Decor', 'icon' => 'flower', 'percentage' => 8, 'order' => 5],
            ['name' => 'Attire & Beauty', 'icon' => 'shirt', 'percentage' => 5, 'order' => 6],
            ['name' => 'Wedding Cake', 'icon' => 'cake', 'percentage' => 3, 'order' => 7],
            ['name' => 'Invitations & Stationery', 'icon' => 'mail', 'percentage' => 2, 'order' => 8],
            ['name' => 'Transportation', 'icon' => 'car', 'percentage' => 2, 'order' => 9],
            ['name' => 'Favors & Gifts', 'icon' => 'gift', 'percentage' => 2, 'order' => 10],
            ['name' => 'Rings & Jewelry', 'icon' => 'gem', 'percentage' => 2, 'order' => 11],
            ['name' => 'Miscellaneous', 'icon' => 'more-horizontal', 'percentage' => 1, 'order' => 12],
        ];
    }
}
