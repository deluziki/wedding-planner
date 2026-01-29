<?php

namespace App\Http\Requests\Timeline;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTimelineEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|string|max:50',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'duration_minutes' => 'nullable|integer|min:1',
            'venue_id' => 'nullable|exists:venues,id',
            'vendor_id' => 'nullable|exists:vendors,id',
            'location' => 'nullable|string|max:255',
            'participants' => 'nullable|array',
            'notes' => 'nullable|string',
            'color' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
        ];
    }
}
