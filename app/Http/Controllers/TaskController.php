<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Models\Task;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request, Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $tasks = $wedding->tasks()
            ->with('assignedMember')
            ->when($request->search, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->priority, fn ($q, $priority) => $q->where('priority', $priority))
            ->when($request->category, fn ($q, $category) => $q->where('category', $category))
            ->when($request->phase, fn ($q, $phase) => $q->where('timeline_phase', $phase))
            ->orderBy($request->sort ?? 'due_date', $request->direction ?? 'asc')
            ->paginate(25)
            ->withQueryString();

        $stats = [
            'total' => $wedding->tasks()->count(),
            'completed' => $wedding->tasks()->where('status', 'completed')->count(),
            'in_progress' => $wedding->tasks()->where('status', 'in_progress')->count(),
            'pending' => $wedding->tasks()->where('status', 'pending')->count(),
            'overdue' => $wedding->tasks()
                ->where('status', '!=', 'completed')
                ->where('due_date', '<', now())
                ->count(),
        ];

        return Inertia::render('weddings/tasks/index', [
            'wedding' => $wedding,
            'tasks' => $tasks,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'priority', 'category', 'phase', 'sort', 'direction']),
            'statuses' => Task::statuses(),
            'priorities' => Task::priorities(),
            'categories' => Task::categories(),
            'phases' => Task::timelinePhases(),
            'partyMembers' => $wedding->weddingPartyMembers()->orderBy('name')->get(),
        ]);
    }

    public function create(Wedding $wedding): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/tasks/create', [
            'wedding' => $wedding,
            'statuses' => Task::statuses(),
            'priorities' => Task::priorities(),
            'categories' => Task::categories(),
            'phases' => Task::timelinePhases(),
            'partyMembers' => $wedding->weddingPartyMembers()->orderBy('name')->get(),
        ]);
    }

    public function store(StoreTaskRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $wedding->tasks()->create($request->validated());

        return redirect()
            ->route('weddings.tasks.index', $wedding)
            ->with('success', 'Task created successfully!');
    }

    public function show(Wedding $wedding, Task $task): Response
    {
        $this->authorize('view', $wedding);

        $task->load('assignedMember');

        return Inertia::render('weddings/tasks/show', [
            'wedding' => $wedding,
            'task' => $task,
        ]);
    }

    public function edit(Wedding $wedding, Task $task): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/tasks/edit', [
            'wedding' => $wedding,
            'task' => $task,
            'statuses' => Task::statuses(),
            'priorities' => Task::priorities(),
            'categories' => Task::categories(),
            'phases' => Task::timelinePhases(),
            'partyMembers' => $wedding->weddingPartyMembers()->orderBy('name')->get(),
        ]);
    }

    public function update(UpdateTaskRequest $request, Wedding $wedding, Task $task): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $data = $request->validated();

        // Set completed_date when marking as completed
        if ($data['status'] === 'completed' && $task->status !== 'completed') {
            $data['completed_date'] = now();
        } elseif ($data['status'] !== 'completed') {
            $data['completed_date'] = null;
        }

        $task->update($data);

        return redirect()
            ->route('weddings.tasks.index', $wedding)
            ->with('success', 'Task updated successfully!');
    }

    public function destroy(Wedding $wedding, Task $task): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $task->delete();

        return redirect()
            ->route('weddings.tasks.index', $wedding)
            ->with('success', 'Task deleted successfully!');
    }

    public function updateStatus(Request $request, Wedding $wedding, Task $task): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $data = $validated;

        if ($validated['status'] === 'completed') {
            $data['completed_date'] = now();
        } else {
            $data['completed_date'] = null;
        }

        $task->update($data);

        return back()->with('success', 'Task status updated!');
    }

    public function reorder(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.order' => 'required|integer',
        ]);

        foreach ($validated['tasks'] as $taskData) {
            Task::where('id', $taskData['id'])
                ->where('wedding_id', $wedding->id)
                ->update(['order' => $taskData['order']]);
        }

        return back()->with('success', 'Tasks reordered!');
    }

    public function checklist(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $tasksByPhase = $wedding->tasks()
            ->orderBy('order')
            ->get()
            ->groupBy('timeline_phase');

        return Inertia::render('weddings/tasks/checklist', [
            'wedding' => $wedding,
            'tasksByPhase' => $tasksByPhase,
            'phases' => Task::timelinePhases(),
        ]);
    }

    public function generateDefaultTasks(Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $defaultTasks = $this->getDefaultTasks();
        $order = $wedding->tasks()->max('order') ?? 0;

        foreach ($defaultTasks as $task) {
            $wedding->tasks()->create([
                ...$task,
                'order' => ++$order,
            ]);
        }

        return back()->with('success', 'Default tasks generated!');
    }

    private function getDefaultTasks(): array
    {
        return [
            // 12+ months before
            ['title' => 'Set wedding date', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '12_months'],
            ['title' => 'Determine budget', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '12_months'],
            ['title' => 'Create guest list', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '12_months'],
            ['title' => 'Research and book venue', 'category' => 'venue', 'priority' => 'high', 'timeline_phase' => '12_months'],
            ['title' => 'Start looking for wedding dress', 'category' => 'attire', 'priority' => 'medium', 'timeline_phase' => '12_months'],

            // 9-12 months before
            ['title' => 'Book photographer', 'category' => 'photography', 'priority' => 'high', 'timeline_phase' => '9_months'],
            ['title' => 'Book videographer', 'category' => 'photography', 'priority' => 'medium', 'timeline_phase' => '9_months'],
            ['title' => 'Book caterer', 'category' => 'catering', 'priority' => 'high', 'timeline_phase' => '9_months'],
            ['title' => 'Book florist', 'category' => 'flowers', 'priority' => 'medium', 'timeline_phase' => '9_months'],
            ['title' => 'Book band or DJ', 'category' => 'music', 'priority' => 'medium', 'timeline_phase' => '9_months'],
            ['title' => 'Choose wedding party', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '9_months'],

            // 6-9 months before
            ['title' => 'Order wedding dress', 'category' => 'attire', 'priority' => 'high', 'timeline_phase' => '6_months'],
            ['title' => 'Book officiant', 'category' => 'legal', 'priority' => 'high', 'timeline_phase' => '6_months'],
            ['title' => 'Send save-the-dates', 'category' => 'invitations', 'priority' => 'high', 'timeline_phase' => '6_months'],
            ['title' => 'Plan honeymoon', 'category' => 'honeymoon', 'priority' => 'medium', 'timeline_phase' => '6_months'],
            ['title' => 'Book transportation', 'category' => 'transportation', 'priority' => 'medium', 'timeline_phase' => '6_months'],

            // 4-6 months before
            ['title' => 'Order invitations', 'category' => 'invitations', 'priority' => 'high', 'timeline_phase' => '4_months'],
            ['title' => 'Finalize guest list', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '4_months'],
            ['title' => 'Choose bridesmaid dresses', 'category' => 'attire', 'priority' => 'medium', 'timeline_phase' => '4_months'],
            ['title' => 'Register for gifts', 'category' => 'other', 'priority' => 'medium', 'timeline_phase' => '4_months'],
            ['title' => 'Book accommodation for guests', 'category' => 'accommodation', 'priority' => 'medium', 'timeline_phase' => '4_months'],

            // 2-4 months before
            ['title' => 'Mail invitations', 'category' => 'invitations', 'priority' => 'high', 'timeline_phase' => '2_months'],
            ['title' => 'Order wedding cake', 'category' => 'catering', 'priority' => 'high', 'timeline_phase' => '2_months'],
            ['title' => 'Plan rehearsal dinner', 'category' => 'catering', 'priority' => 'medium', 'timeline_phase' => '2_months'],
            ['title' => 'Book hair and makeup', 'category' => 'attire', 'priority' => 'medium', 'timeline_phase' => '2_months'],
            ['title' => 'Purchase wedding rings', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '2_months'],

            // 1-2 months before
            ['title' => 'Apply for marriage license', 'category' => 'legal', 'priority' => 'high', 'timeline_phase' => '1_month'],
            ['title' => 'Final dress fitting', 'category' => 'attire', 'priority' => 'high', 'timeline_phase' => '1_month'],
            ['title' => 'Confirm all vendors', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '1_month'],
            ['title' => 'Create seating chart', 'category' => 'other', 'priority' => 'medium', 'timeline_phase' => '1_month'],
            ['title' => 'Write vows', 'category' => 'other', 'priority' => 'medium', 'timeline_phase' => '1_month'],

            // 2-4 weeks before
            ['title' => 'Final RSVP count', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '2_weeks'],
            ['title' => 'Give final count to caterer', 'category' => 'catering', 'priority' => 'high', 'timeline_phase' => '2_weeks'],
            ['title' => 'Confirm honeymoon reservations', 'category' => 'honeymoon', 'priority' => 'medium', 'timeline_phase' => '2_weeks'],
            ['title' => 'Break in wedding shoes', 'category' => 'attire', 'priority' => 'low', 'timeline_phase' => '2_weeks'],

            // 1 week before
            ['title' => 'Confirm timeline with all vendors', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '1_week'],
            ['title' => 'Pack for honeymoon', 'category' => 'honeymoon', 'priority' => 'medium', 'timeline_phase' => '1_week'],
            ['title' => 'Prepare payments for vendors', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => '1_week'],

            // Day before
            ['title' => 'Attend rehearsal', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => 'day_before'],
            ['title' => 'Give marriage license to officiant', 'category' => 'legal', 'priority' => 'high', 'timeline_phase' => 'day_before'],
            ['title' => 'Confirm transportation', 'category' => 'transportation', 'priority' => 'high', 'timeline_phase' => 'day_before'],

            // After wedding
            ['title' => 'Send thank you notes', 'category' => 'other', 'priority' => 'high', 'timeline_phase' => 'after_wedding'],
            ['title' => 'Change name on documents', 'category' => 'legal', 'priority' => 'medium', 'timeline_phase' => 'after_wedding'],
            ['title' => 'Preserve wedding dress', 'category' => 'attire', 'priority' => 'low', 'timeline_phase' => 'after_wedding'],
        ];
    }
}
