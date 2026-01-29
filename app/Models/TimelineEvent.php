<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimelineEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'venue_id',
        'vendor_id',
        'title',
        'description',
        'type',
        'start_time',
        'end_time',
        'duration_minutes',
        'location',
        'participants',
        'notes',
        'color',
        'order',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'duration_minutes' => 'integer',
        'participants' => 'array',
        'order' => 'integer',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public static function types(): array
    {
        return [
            'preparation' => 'Preparation',
            'hair_makeup' => 'Hair & Makeup',
            'photography' => 'Photography',
            'ceremony' => 'Ceremony',
            'cocktail_hour' => 'Cocktail Hour',
            'reception' => 'Reception',
            'dinner' => 'Dinner',
            'speeches' => 'Speeches & Toasts',
            'first_dance' => 'First Dance',
            'cake_cutting' => 'Cake Cutting',
            'bouquet_toss' => 'Bouquet/Garter Toss',
            'dancing' => 'Dancing',
            'departure' => 'Departure',
            'other' => 'Other',
        ];
    }

    public static function defaultTimeline(): array
    {
        return [
            ['title' => 'Bridal Party Gets Ready', 'type' => 'preparation', 'start_time' => '09:00', 'duration_minutes' => 180],
            ['title' => 'Hair & Makeup', 'type' => 'hair_makeup', 'start_time' => '09:00', 'duration_minutes' => 180],
            ['title' => 'First Look Photos', 'type' => 'photography', 'start_time' => '12:00', 'duration_minutes' => 60],
            ['title' => 'Wedding Party Photos', 'type' => 'photography', 'start_time' => '13:00', 'duration_minutes' => 60],
            ['title' => 'Guests Arrive', 'type' => 'ceremony', 'start_time' => '14:30', 'duration_minutes' => 30],
            ['title' => 'Ceremony Begins', 'type' => 'ceremony', 'start_time' => '15:00', 'duration_minutes' => 30],
            ['title' => 'Family Photos', 'type' => 'photography', 'start_time' => '15:30', 'duration_minutes' => 30],
            ['title' => 'Cocktail Hour', 'type' => 'cocktail_hour', 'start_time' => '16:00', 'duration_minutes' => 60],
            ['title' => 'Grand Entrance', 'type' => 'reception', 'start_time' => '17:00', 'duration_minutes' => 15],
            ['title' => 'First Dance', 'type' => 'first_dance', 'start_time' => '17:15', 'duration_minutes' => 5],
            ['title' => 'Dinner Service', 'type' => 'dinner', 'start_time' => '17:30', 'duration_minutes' => 90],
            ['title' => 'Toasts & Speeches', 'type' => 'speeches', 'start_time' => '19:00', 'duration_minutes' => 30],
            ['title' => 'Cake Cutting', 'type' => 'cake_cutting', 'start_time' => '19:30', 'duration_minutes' => 15],
            ['title' => 'Open Dancing', 'type' => 'dancing', 'start_time' => '19:45', 'duration_minutes' => 135],
            ['title' => 'Bouquet & Garter Toss', 'type' => 'bouquet_toss', 'start_time' => '21:00', 'duration_minutes' => 15],
            ['title' => 'Last Dance', 'type' => 'dancing', 'start_time' => '22:00', 'duration_minutes' => 5],
            ['title' => 'Grand Exit', 'type' => 'departure', 'start_time' => '22:05', 'duration_minutes' => 15],
        ];
    }
}
