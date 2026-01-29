<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vendor_category_id' => 'required|exists:vendor_categories,id',
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'status' => 'nullable|in:considering,contacted,booked,declined,cancelled',
            'quoted_price' => 'nullable|numeric|min:0',
            'final_price' => 'nullable|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'deposit_due_date' => 'nullable|date',
            'balance_due' => 'nullable|numeric|min:0',
            'balance_due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'services' => 'nullable|array',
        ];
    }
}
