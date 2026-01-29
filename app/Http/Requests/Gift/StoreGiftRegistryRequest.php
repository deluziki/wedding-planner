<?php

namespace App\Http\Requests\Gift;

use Illuminate\Foundation\Http\FormRequest;

class StoreGiftRegistryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'store_name' => 'required|string|max:255',
            'registry_url' => 'nullable|url|max:255',
            'registry_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'is_primary' => 'boolean',
        ];
    }
}
