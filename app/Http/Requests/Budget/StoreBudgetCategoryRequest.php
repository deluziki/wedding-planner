<?php

namespace App\Http\Requests\Budget;

use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'estimated_amount' => 'nullable|numeric|min:0',
            'percentage' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ];
    }
}
