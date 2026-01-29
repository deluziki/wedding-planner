<?php

namespace App\Http\Requests\Seating;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeatingTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'shape' => 'nullable|in:round,rectangular,square,oval,u_shape,head_table',
            'capacity' => 'sometimes|required|integer|min:1|max:100',
            'location' => 'nullable|string|max:255',
            'position_x' => 'nullable|numeric',
            'position_y' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
        ];
    }
}
