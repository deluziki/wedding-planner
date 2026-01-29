<?php

namespace App\Http\Requests\Seating;

use Illuminate\Foundation\Http\FormRequest;

class StoreSeatingTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'shape' => 'nullable|in:round,rectangular,square,oval,u_shape,head_table',
            'capacity' => 'required|integer|min:1|max:100',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }
}
