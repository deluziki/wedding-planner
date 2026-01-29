<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SeatingTable extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'name',
        'shape',
        'capacity',
        'location',
        'position_x',
        'position_y',
        'notes',
        'order',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'position_x' => 'decimal:2',
        'position_y' => 'decimal:2',
        'order' => 'integer',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class, 'table_id');
    }

    public function getSeatsFilledAttribute(): int
    {
        return $this->guests()->count();
    }

    public function getAvailableSeatsAttribute(): int
    {
        return $this->capacity - $this->seats_filled;
    }

    public function getIsFull(): bool
    {
        return $this->available_seats <= 0;
    }

    public static function shapes(): array
    {
        return [
            'round' => 'Round',
            'rectangular' => 'Rectangular',
            'square' => 'Square',
            'oval' => 'Oval',
            'u_shape' => 'U-Shape',
            'head_table' => 'Head Table',
        ];
    }
}
