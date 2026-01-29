<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'name',
        'type',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'contact_name',
        'contact_email',
        'contact_phone',
        'website',
        'capacity',
        'cost',
        'deposit',
        'deposit_due_date',
        'deposit_paid',
        'is_booked',
        'booking_date',
        'notes',
        'amenities',
        'images',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'capacity' => 'integer',
        'cost' => 'decimal:2',
        'deposit' => 'decimal:2',
        'deposit_due_date' => 'date',
        'deposit_paid' => 'boolean',
        'is_booked' => 'boolean',
        'booking_date' => 'date',
        'amenities' => 'array',
        'images' => 'array',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function timelineEvents(): HasMany
    {
        return $this->hasMany(TimelineEvent::class);
    }

    public function getFullAddressAttribute(): string
    {
        return collect([
            $this->address,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country,
        ])->filter()->implode(', ');
    }
}
