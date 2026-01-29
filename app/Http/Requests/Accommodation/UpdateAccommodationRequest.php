<?php

namespace App\Http\Requests\Accommodation;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccommodationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hotel_name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'booking_code' => 'nullable|string|max:255',
            'rate_per_night' => 'nullable|numeric|min:0',
            'block_start_date' => 'nullable|date',
            'block_end_date' => 'nullable|date|after_or_equal:block_start_date',
            'booking_deadline' => 'nullable|date',
            'rooms_blocked' => 'nullable|integer|min:0',
            'rooms_booked' => 'nullable|integer|min:0',
            'distance_to_venue' => 'nullable|string|max:255',
            'amenities' => 'nullable|string',
            'notes' => 'nullable|string',
            'is_primary' => 'boolean',
        ];
    }
}
