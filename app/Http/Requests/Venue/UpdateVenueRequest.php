<?php

namespace App\Http\Requests\Venue;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVenueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|in:ceremony,reception,both',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'contact_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'capacity' => 'nullable|integer|min:1',
            'cost' => 'nullable|numeric|min:0',
            'deposit' => 'nullable|numeric|min:0',
            'deposit_due_date' => 'nullable|date',
            'deposit_paid' => 'boolean',
            'is_booked' => 'boolean',
            'booking_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'amenities' => 'nullable|array',
            'images' => 'nullable|array',
        ];
    }
}
