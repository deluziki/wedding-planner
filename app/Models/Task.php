<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'assigned_to',
        'title',
        'description',
        'category',
        'status',
        'priority',
        'due_date',
        'completed_date',
        'timeline_phase',
        'notes',
        'checklist',
        'order',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_date' => 'date',
        'checklist' => 'array',
        'order' => 'integer',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function assignedMember(): BelongsTo
    {
        return $this->belongsTo(WeddingPartyMember::class, 'assigned_to');
    }

    public function getIsOverdueAttribute(): bool
    {
        if (!$this->due_date || $this->status === 'completed') {
            return false;
        }
        return $this->due_date->isPast();
    }

    public static function statuses(): array
    {
        return [
            'pending' => 'Pending',
            'in_progress' => 'In Progress',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];
    }

    public static function priorities(): array
    {
        return [
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
            'urgent' => 'Urgent',
        ];
    }

    public static function categories(): array
    {
        return [
            'venue' => 'Venue',
            'catering' => 'Catering',
            'attire' => 'Attire',
            'decor' => 'Decorations',
            'photography' => 'Photography',
            'music' => 'Music & Entertainment',
            'flowers' => 'Flowers',
            'invitations' => 'Invitations',
            'legal' => 'Legal & Documents',
            'transportation' => 'Transportation',
            'accommodation' => 'Accommodation',
            'honeymoon' => 'Honeymoon',
            'other' => 'Other',
        ];
    }

    public static function timelinePhases(): array
    {
        return [
            '12_months' => '12+ Months Before',
            '9_months' => '9-12 Months Before',
            '6_months' => '6-9 Months Before',
            '4_months' => '4-6 Months Before',
            '2_months' => '2-4 Months Before',
            '1_month' => '1-2 Months Before',
            '2_weeks' => '2-4 Weeks Before',
            '1_week' => '1-2 Weeks Before',
            'day_before' => 'Day Before',
            'wedding_day' => 'Wedding Day',
            'after_wedding' => 'After Wedding',
        ];
    }
}
