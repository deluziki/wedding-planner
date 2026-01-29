<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Accommodation extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'hotel_name',
        'address',
        'city',
        'phone',
        'website',
        'booking_code',
        'rate_per_night',
        'block_start_date',
        'block_end_date',
        'booking_deadline',
        'rooms_blocked',
        'rooms_booked',
        'distance_to_venue',
        'amenities',
        'notes',
        'is_primary',
    ];

    protected $casts = [
        'rate_per_night' => 'decimal:2',
        'block_start_date' => 'date',
        'block_end_date' => 'date',
        'booking_deadline' => 'date',
        'rooms_blocked' => 'integer',
        'rooms_booked' => 'integer',
        'is_primary' => 'boolean',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function guestAccommodations(): HasMany
    {
        return $this->hasMany(GuestAccommodation::class);
    }

    public function getRoomsAvailableAttribute(): int
    {
        return ($this->rooms_blocked ?? 0) - ($this->rooms_booked ?? 0);
    }
}
