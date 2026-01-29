<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'guest_id',
        'type',
        'delivery_method',
        'status',
        'sent_date',
        'delivered_date',
        'tracking_number',
        'address_used',
        'notes',
    ];

    protected $casts = [
        'sent_date' => 'date',
        'delivered_date' => 'date',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public static function types(): array
    {
        return [
            'save_the_date' => 'Save the Date',
            'formal' => 'Formal Invitation',
            'rehearsal_dinner' => 'Rehearsal Dinner',
            'bridal_shower' => 'Bridal Shower',
            'bachelor_party' => 'Bachelor Party',
            'bachelorette_party' => 'Bachelorette Party',
            'thank_you' => 'Thank You Card',
        ];
    }

    public static function deliveryMethods(): array
    {
        return [
            'mail' => 'Mail',
            'email' => 'Email',
            'hand_delivered' => 'Hand Delivered',
        ];
    }

    public static function statuses(): array
    {
        return [
            'pending' => 'Pending',
            'sent' => 'Sent',
            'delivered' => 'Delivered',
            'returned' => 'Returned',
        ];
    }
}
