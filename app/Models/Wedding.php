<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Wedding extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'bride_name',
        'groom_name',
        'wedding_date',
        'ceremony_time',
        'reception_time',
        'wedding_style',
        'color_scheme',
        'theme_description',
        'status',
        'total_budget',
        'currency',
        'cover_image',
        'settings',
    ];

    protected $casts = [
        'wedding_date' => 'date',
        'ceremony_time' => 'datetime:H:i',
        'reception_time' => 'datetime:H:i',
        'total_budget' => 'decimal:2',
        'settings' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function venues(): HasMany
    {
        return $this->hasMany(Venue::class);
    }

    public function ceremonyVenue(): HasOne
    {
        return $this->hasOne(Venue::class)->where('type', 'ceremony');
    }

    public function receptionVenue(): HasOne
    {
        return $this->hasOne(Venue::class)->where('type', 'reception');
    }

    public function weddingPartyMembers(): HasMany
    {
        return $this->hasMany(WeddingPartyMember::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class);
    }

    public function vendors(): HasMany
    {
        return $this->hasMany(Vendor::class);
    }

    public function budgetCategories(): HasMany
    {
        return $this->hasMany(BudgetCategory::class);
    }

    public function budgetItems(): HasMany
    {
        return $this->hasMany(BudgetItem::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function timelineEvents(): HasMany
    {
        return $this->hasMany(TimelineEvent::class);
    }

    public function seatingTables(): HasMany
    {
        return $this->hasMany(SeatingTable::class);
    }

    public function giftRegistries(): HasMany
    {
        return $this->hasMany(GiftRegistry::class);
    }

    public function gifts(): HasMany
    {
        return $this->hasMany(Gift::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }

    public function marriageCertificate(): HasOne
    {
        return $this->hasOne(MarriageCertificate::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class);
    }

    public function accommodations(): HasMany
    {
        return $this->hasMany(Accommodation::class);
    }

    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }

    // Computed attributes
    public function getTotalSpentAttribute(): float
    {
        return $this->budgetItems()->sum('actual_cost');
    }

    public function getRemainingBudgetAttribute(): float
    {
        return $this->total_budget - $this->total_spent;
    }

    public function getConfirmedGuestsCountAttribute(): int
    {
        return $this->guests()->where('rsvp_status', 'confirmed')->count();
    }

    public function getDaysUntilWeddingAttribute(): ?int
    {
        if (!$this->wedding_date) {
            return null;
        }
        return now()->diffInDays($this->wedding_date, false);
    }
}
