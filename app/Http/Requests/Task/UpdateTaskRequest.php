<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'status' => 'nullable|in:pending,in_progress,completed,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'timeline_phase' => 'nullable|string|max:50',
            'assigned_to' => 'nullable|exists:wedding_party_members,id',
            'notes' => 'nullable|string',
            'checklist' => 'nullable|array',
            'order' => 'nullable|integer|min:0',
        ];
    }
}
