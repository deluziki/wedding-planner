<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'title',
        'description',
        'file_path',
        'thumbnail_path',
        'category',
        'album',
        'is_favorite',
        'is_public',
        'tags',
        'order',
    ];

    protected $casts = [
        'is_favorite' => 'boolean',
        'is_public' => 'boolean',
        'tags' => 'array',
        'order' => 'integer',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public static function categories(): array
    {
        return [
            'engagement' => 'Engagement',
            'bridal_shower' => 'Bridal Shower',
            'bachelor_party' => 'Bachelor Party',
            'bachelorette_party' => 'Bachelorette Party',
            'rehearsal_dinner' => 'Rehearsal Dinner',
            'getting_ready' => 'Getting Ready',
            'first_look' => 'First Look',
            'ceremony' => 'Ceremony',
            'portraits' => 'Portraits',
            'wedding_party' => 'Wedding Party',
            'family' => 'Family',
            'reception' => 'Reception',
            'details' => 'Details',
            'other' => 'Other',
        ];
    }
}
