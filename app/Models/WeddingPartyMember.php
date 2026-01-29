<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WeddingPartyMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'name',
        'email',
        'phone',
        'role',
        'side',
        'relationship',
        'responsibilities',
        'attire_status',
        'attire_details',
        'attire_cost',
        'notes',
        'photo',
        'order',
    ];

    protected $casts = [
        'attire_cost' => 'decimal:2',
        'order' => 'integer',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public static function roles(): array
    {
        return [
            'maid_of_honor' => 'Maid of Honor',
            'matron_of_honor' => 'Matron of Honor',
            'best_man' => 'Best Man',
            'bridesmaid' => 'Bridesmaid',
            'groomsman' => 'Groomsman',
            'junior_bridesmaid' => 'Junior Bridesmaid',
            'junior_groomsman' => 'Junior Groomsman',
            'flower_girl' => 'Flower Girl',
            'ring_bearer' => 'Ring Bearer',
            'usher' => 'Usher',
            'officiant' => 'Officiant',
            'father_of_bride' => 'Father of the Bride',
            'mother_of_bride' => 'Mother of the Bride',
            'father_of_groom' => 'Father of the Groom',
            'mother_of_groom' => 'Mother of the Groom',
            'reader' => 'Reader',
            'musician' => 'Musician',
            'other' => 'Other',
        ];
    }
}
