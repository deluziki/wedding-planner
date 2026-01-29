<?php

namespace App\Http\Requests\WeddingParty;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWeddingPartyMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'role' => 'sometimes|required|string|max:50',
            'side' => 'sometimes|required|in:bride,groom',
            'relationship' => 'nullable|string|max:255',
            'responsibilities' => 'nullable|string',
            'attire_status' => 'nullable|in:pending,ordered,fitted,ready',
            'attire_details' => 'nullable|string|max:255',
            'attire_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'photo' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
        ];
    }
}
