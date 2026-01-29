<?php

namespace App\Http\Requests\Menu;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'course' => 'nullable|string|max:50',
            'price_per_person' => 'nullable|numeric|min:0',
            'dietary_info' => 'nullable|array',
            'allergens' => 'nullable|array',
            'is_available' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ];
    }
}
