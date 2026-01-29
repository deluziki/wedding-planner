<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GiftRegistry extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'store_name',
        'registry_url',
        'registry_id',
        'notes',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function gifts(): HasMany
    {
        return $this->hasMany(Gift::class);
    }
}
