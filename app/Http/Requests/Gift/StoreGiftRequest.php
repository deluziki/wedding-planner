<?php

namespace App\Http\Requests\Gift;

use Illuminate\Foundation\Http\FormRequest;

class StoreGiftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'guest_id' => 'nullable|exists:guests,id',
            'gift_registry_id' => 'nullable|exists:gift_registries,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'value' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:received,returned,exchanged',
            'received_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }
}
