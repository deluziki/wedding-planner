<?php

namespace App\Http\Controllers;

use App\Http\Requests\Wedding\StoreWeddingRequest;
use App\Http\Requests\Wedding\UpdateWeddingRequest;
use App\Models\BudgetCategory;
use App\Models\VendorCategory;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WeddingController extends Controller
{
    public function index(Request $request): Response
    {
        $weddings = $request->user()
            ->weddings()
            ->withCount(['guests', 'tasks', 'vendors'])
            ->latest()
            ->get();

        return Inertia::render('weddings/index', [
            'weddings' => $weddings,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('weddings/create');
    }

    public function store(StoreWeddingRequest $request): RedirectResponse
    {
        $wedding = $request->user()->weddings()->create($request->validated());

        // Create default budget categories
        foreach (BudgetCategory::defaultCategories() as $category) {
            $wedding->budgetCategories()->create([
                'name' => $category['name'],
                'icon' => $category['icon'],
                'percentage' => $category['percentage'],
                'order' => $category['order'],
                'estimated_amount' => $wedding->total_budget
                    ? ($wedding->total_budget * $category['percentage'] / 100)
                    : 0,
            ]);
        }

        return redirect()
            ->route('weddings.show', $wedding)
            ->with('success', 'Wedding created successfully!');
    }

    public function show(Request $request, Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $wedding->load([
            'venues',
            'weddingPartyMembers' => fn ($q) => $q->orderBy('order'),
            'budgetCategories' => fn ($q) => $q->orderBy('order'),
        ]);

        $wedding->loadCount([
            'guests',
            'guests as confirmed_guests_count' => fn ($q) => $q->where('rsvp_status', 'confirmed'),
            'guests as pending_guests_count' => fn ($q) => $q->where('rsvp_status', 'pending'),
            'tasks',
            'tasks as completed_tasks_count' => fn ($q) => $q->where('status', 'completed'),
            'tasks as pending_tasks_count' => fn ($q) => $q->whereIn('status', ['pending', 'in_progress']),
            'vendors',
            'vendors as booked_vendors_count' => fn ($q) => $q->where('status', 'booked'),
        ]);

        $totalSpent = $wedding->budgetItems()->sum('actual_cost');
        $totalPaid = $wedding->budgetItems()->sum('paid_amount');

        return Inertia::render('weddings/show', [
            'wedding' => $wedding,
            'stats' => [
                'total_spent' => $totalSpent,
                'total_paid' => $totalPaid,
                'remaining_budget' => $wedding->total_budget - $totalSpent,
                'days_until_wedding' => $wedding->days_until_wedding,
            ],
        ]);
    }

    public function edit(Wedding $wedding): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/edit', [
            'wedding' => $wedding,
        ]);
    }

    public function update(UpdateWeddingRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $wedding->update($request->validated());

        return redirect()
            ->route('weddings.show', $wedding)
            ->with('success', 'Wedding updated successfully!');
    }

    public function destroy(Wedding $wedding): RedirectResponse
    {
        $this->authorize('delete', $wedding);

        $wedding->delete();

        return redirect()
            ->route('weddings.index')
            ->with('success', 'Wedding deleted successfully!');
    }

    public function dashboard(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $wedding->load([
            'venues',
            'tasks' => fn ($q) => $q->whereIn('status', ['pending', 'in_progress'])
                ->orderBy('due_date')
                ->limit(5),
            'vendors' => fn ($q) => $q->where('status', 'booked')->with('category'),
        ]);

        $wedding->loadCount([
            'guests',
            'guests as confirmed_guests_count' => fn ($q) => $q->where('rsvp_status', 'confirmed'),
            'guests as declined_guests_count' => fn ($q) => $q->where('rsvp_status', 'declined'),
            'guests as pending_guests_count' => fn ($q) => $q->where('rsvp_status', 'pending'),
            'tasks',
            'tasks as completed_tasks_count' => fn ($q) => $q->where('status', 'completed'),
        ]);

        $budgetSummary = [
            'total_budget' => $wedding->total_budget,
            'total_estimated' => $wedding->budgetItems()->sum('estimated_cost'),
            'total_actual' => $wedding->budgetItems()->sum('actual_cost'),
            'total_paid' => $wedding->budgetItems()->sum('paid_amount'),
        ];

        $upcomingPayments = $wedding->budgetItems()
            ->where('is_paid', false)
            ->whereNotNull('due_date')
            ->orderBy('due_date')
            ->limit(5)
            ->get();

        return Inertia::render('weddings/dashboard', [
            'wedding' => $wedding,
            'budgetSummary' => $budgetSummary,
            'upcomingPayments' => $upcomingPayments,
        ]);
    }
}
