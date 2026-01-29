<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Gift extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'guest_id',
        'gift_registry_id',
        'name',
        'description',
        'value',
        'status',
        'received_date',
        'thank_you_sent',
        'thank_you_date',
        'notes',
        'image',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'received_date' => 'date',
        'thank_you_sent' => 'boolean',
        'thank_you_date' => 'date',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function registry(): BelongsTo
    {
        return $this->belongsTo(GiftRegistry::class, 'gift_registry_id');
    }

    public static function statuses(): array
    {
        return [
            'received' => 'Received',
            'returned' => 'Returned',
            'exchanged' => 'Exchanged',
        ];
    }
}
