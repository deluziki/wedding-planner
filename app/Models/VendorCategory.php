<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VendorCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function vendors(): HasMany
    {
        return $this->hasMany(Vendor::class);
    }

    public static function defaultCategories(): array
    {
        return [
            ['name' => 'Venue', 'slug' => 'venue', 'icon' => 'building', 'order' => 1],
            ['name' => 'Catering', 'slug' => 'catering', 'icon' => 'utensils', 'order' => 2],
            ['name' => 'Photography', 'slug' => 'photography', 'icon' => 'camera', 'order' => 3],
            ['name' => 'Videography', 'slug' => 'videography', 'icon' => 'video', 'order' => 4],
            ['name' => 'Florist', 'slug' => 'florist', 'icon' => 'flower', 'order' => 5],
            ['name' => 'Music & DJ', 'slug' => 'music-dj', 'icon' => 'music', 'order' => 6],
            ['name' => 'Wedding Cake', 'slug' => 'wedding-cake', 'icon' => 'cake', 'order' => 7],
            ['name' => 'Wedding Planner', 'slug' => 'wedding-planner', 'icon' => 'clipboard', 'order' => 8],
            ['name' => 'Hair & Makeup', 'slug' => 'hair-makeup', 'icon' => 'sparkles', 'order' => 9],
            ['name' => 'Dress & Attire', 'slug' => 'dress-attire', 'icon' => 'shirt', 'order' => 10],
            ['name' => 'Transportation', 'slug' => 'transportation', 'icon' => 'car', 'order' => 11],
            ['name' => 'Invitations & Stationery', 'slug' => 'invitations', 'icon' => 'mail', 'order' => 12],
            ['name' => 'Decorations', 'slug' => 'decorations', 'icon' => 'palette', 'order' => 13],
            ['name' => 'Rentals', 'slug' => 'rentals', 'icon' => 'package', 'order' => 14],
            ['name' => 'Officiant', 'slug' => 'officiant', 'icon' => 'book', 'order' => 15],
            ['name' => 'Jeweler', 'slug' => 'jeweler', 'icon' => 'gem', 'order' => 16],
            ['name' => 'Entertainment', 'slug' => 'entertainment', 'icon' => 'party-popper', 'order' => 17],
            ['name' => 'Photo Booth', 'slug' => 'photo-booth', 'icon' => 'image', 'order' => 18],
            ['name' => 'Favors & Gifts', 'slug' => 'favors-gifts', 'icon' => 'gift', 'order' => 19],
            ['name' => 'Other', 'slug' => 'other', 'icon' => 'more-horizontal', 'order' => 99],
        ];
    }
}
