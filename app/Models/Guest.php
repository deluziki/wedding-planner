<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'group',
        'side',
        'relationship',
        'rsvp_status',
        'rsvp_date',
        'attending_ceremony',
        'attending_reception',
        'plus_one_allowed',
        'plus_one_count',
        'plus_one_name',
        'dietary_restrictions',
        'meal_choice',
        'special_requests',
        'table_id',
        'seat_number',
        'is_child',
        'age',
        'notes',
    ];

    protected $casts = [
        'rsvp_date' => 'date',
        'attending_ceremony' => 'boolean',
        'attending_reception' => 'boolean',
        'plus_one_allowed' => 'integer',
        'plus_one_count' => 'integer',
        'dietary_restrictions' => 'array',
        'is_child' => 'boolean',
        'age' => 'integer',
        'seat_number' => 'integer',
    ];

    protected $appends = ['full_name'];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function seatingTable(): BelongsTo
    {
        return $this->belongsTo(SeatingTable::class, 'table_id');
    }

    public function invitation(): HasOne
    {
        return $this->hasOne(Invitation::class);
    }

    public function gifts(): HasMany
    {
        return $this->hasMany(Gift::class);
    }

    public function accommodations(): HasMany
    {
        return $this->hasMany(GuestAccommodation::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
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

    public function getTotalAttendingAttribute(): int
    {
        return 1 + $this->plus_one_count;
    }

    public static function groups(): array
    {
        return [
            'family' => 'Family',
            'friends' => 'Friends',
            'coworkers' => 'Coworkers',
            'neighbors' => 'Neighbors',
            'other' => 'Other',
        ];
    }

    public static function rsvpStatuses(): array
    {
        return [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'declined' => 'Declined',
            'maybe' => 'Maybe',
        ];
    }
}
