<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'name',
        'description',
        'course',
        'price_per_person',
        'dietary_info',
        'allergens',
        'is_available',
        'order',
    ];

    protected $casts = [
        'price_per_person' => 'decimal:2',
        'dietary_info' => 'array',
        'allergens' => 'array',
        'is_available' => 'boolean',
        'order' => 'integer',
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public static function courses(): array
    {
        return [
            'appetizer' => 'Appetizer',
            'soup' => 'Soup',
            'salad' => 'Salad',
            'main' => 'Main Course',
            'dessert' => 'Dessert',
            'beverage' => 'Beverage',
        ];
    }

    public static function dietaryOptions(): array
    {
        return [
            'vegetarian' => 'Vegetarian',
            'vegan' => 'Vegan',
            'gluten_free' => 'Gluten Free',
            'dairy_free' => 'Dairy Free',
            'nut_free' => 'Nut Free',
            'halal' => 'Halal',
            'kosher' => 'Kosher',
        ];
    }
}
