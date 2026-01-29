<?php

namespace App\Http\Requests\Guest;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGuestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'group' => 'nullable|string|max:50',
            'side' => 'nullable|in:bride,groom,both',
            'relationship' => 'nullable|string|max:255',
            'rsvp_status' => 'nullable|in:pending,confirmed,declined,maybe',
            'attending_ceremony' => 'boolean',
            'attending_reception' => 'boolean',
            'plus_one_allowed' => 'nullable|integer|min:0',
            'plus_one_count' => 'nullable|integer|min:0',
            'plus_one_name' => 'nullable|string|max:255',
            'dietary_restrictions' => 'nullable|array',
            'meal_choice' => 'nullable|string|max:255',
            'special_requests' => 'nullable|string',
            'table_id' => 'nullable|exists:seating_tables,id',
            'seat_number' => 'nullable|integer|min:1',
            'is_child' => 'boolean',
            'age' => 'nullable|integer|min:0|max:150',
            'notes' => 'nullable|string',
        ];
    }
}
