<?php

namespace App\Http\Requests\Budget;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBudgetItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'budget_category_id' => 'sometimes|exists:budget_categories,id',
            'vendor_id' => 'nullable|exists:vendors,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'estimated_cost' => 'nullable|numeric|min:0',
            'actual_cost' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'nullable|in:pending,partial,paid',
            'due_date' => 'nullable|date',
            'is_paid' => 'boolean',
            'paid_date' => 'nullable|date',
            'payment_method' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'receipt' => 'nullable|string',
            'priority' => 'nullable|integer|min:0|max:5',
        ];
    }
}
