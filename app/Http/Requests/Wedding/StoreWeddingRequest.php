<?php

namespace App\Http\Requests\Wedding;

use Illuminate\Foundation\Http\FormRequest;

class StoreWeddingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'bride_name' => 'required|string|max:255',
            'groom_name' => 'required|string|max:255',
            'wedding_date' => 'nullable|date|after:today',
            'ceremony_time' => 'nullable|date_format:H:i',
            'reception_time' => 'nullable|date_format:H:i',
            'wedding_style' => 'nullable|string|max:255',
            'color_scheme' => 'nullable|string|max:255',
            'theme_description' => 'nullable|string',
            'total_budget' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|size:3',
        ];
    }
}
