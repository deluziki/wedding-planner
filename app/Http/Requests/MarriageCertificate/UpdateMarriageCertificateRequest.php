<?php

namespace App\Http\Requests\MarriageCertificate;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMarriageCertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'certificate_number' => 'nullable|string|max:255',
            'license_number' => 'nullable|string|max:255',
            'license_issue_date' => 'nullable|date',
            'license_expiry_date' => 'nullable|date',
            'issuing_authority' => 'nullable|string|max:255',
            'issuing_location' => 'nullable|string|max:255',
            'bride_legal_name' => 'sometimes|required|string|max:255',
            'groom_legal_name' => 'sometimes|required|string|max:255',
            'marriage_date' => 'nullable|date',
            'marriage_location' => 'nullable|string|max:255',
            'officiant_name' => 'nullable|string|max:255',
            'officiant_title' => 'nullable|string|max:255',
            'witness_1_name' => 'nullable|string|max:255',
            'witness_2_name' => 'nullable|string|max:255',
            'status' => 'nullable|in:pending,applied,received,filed',
            'application_date' => 'nullable|date',
            'received_date' => 'nullable|date',
            'fee' => 'nullable|numeric|min:0',
            'fee_paid' => 'boolean',
            'certificate_file' => 'nullable|string',
            'license_file' => 'nullable|string',
            'notes' => 'nullable|string',
            'requirements_checklist' => 'nullable|array',
        ];
    }
}
