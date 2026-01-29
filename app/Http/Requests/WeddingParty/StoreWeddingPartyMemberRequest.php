<?php

namespace App\Http\Requests\WeddingParty;

use Illuminate\Foundation\Http\FormRequest;

class StoreWeddingPartyMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'role' => 'required|string|max:50',
            'side' => 'required|in:bride,groom',
            'relationship' => 'nullable|string|max:255',
            'responsibilities' => 'nullable|string',
            'attire_details' => 'nullable|string|max:255',
            'attire_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ];
    }
}
