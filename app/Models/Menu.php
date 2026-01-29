<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'name',
        'type',
        'description',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    public static function types(): array
    {
        return [
            'dinner' => 'Dinner',
            'cocktail' => 'Cocktail Hour',
            'dessert' => 'Dessert',
            'kids' => 'Kids Menu',
            'vegetarian' => 'Vegetarian',
            'vegan' => 'Vegan',
            'gluten_free' => 'Gluten Free',
        ];
    }
}
