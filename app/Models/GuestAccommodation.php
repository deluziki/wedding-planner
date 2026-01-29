<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuestAccommodation extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'accommodation_id',
        'check_in_date',
        'check_out_date',
        'room_type',
        'confirmation_number',
        'special_requests',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
    ];

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function accommodation(): BelongsTo
    {
        return $this->belongsTo(Accommodation::class);
    }

    public function getNightsAttribute(): int
    {
        if (!$this->check_in_date || !$this->check_out_date) {
            return 0;
        }
        return $this->check_in_date->diffInDays($this->check_out_date);
    }
}
