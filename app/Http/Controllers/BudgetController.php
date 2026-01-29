<?php

namespace App\Http\Controllers;

use App\Http\Requests\Budget\StoreBudgetCategoryRequest;
use App\Http\Requests\Budget\StoreBudgetItemRequest;
use App\Http\Requests\Budget\UpdateBudgetCategoryRequest;
use App\Http\Requests\Budget\UpdateBudgetItemRequest;
use App\Models\BudgetCategory;
use App\Models\BudgetItem;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function index(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $categories = $wedding->budgetCategories()
            ->with(['items' => fn ($q) => $q->orderBy('name')])
            ->withSum('items', 'estimated_cost')
            ->withSum('items', 'actual_cost')
            ->withSum('items', 'paid_amount')
            ->orderBy('order')
            ->get();

        $summary = [
            'total_budget' => $wedding->total_budget,
            'total_estimated' => $wedding->budgetItems()->sum('estimated_cost'),
            'total_actual' => $wedding->budgetItems()->sum('actual_cost'),
            'total_paid' => $wedding->budgetItems()->sum('paid_amount'),
            'remaining' => $wedding->total_budget - $wedding->budgetItems()->sum('actual_cost'),
        ];

        return Inertia::render('weddings/budget/index', [
            'wedding' => $wedding,
            'categories' => $categories,
            'summary' => $summary,
            'paymentStatuses' => BudgetItem::paymentStatuses(),
            'paymentMethods' => BudgetItem::paymentMethods(),
        ]);
    }

    public function storeCategory(StoreBudgetCategoryRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $maxOrder = $wedding->budgetCategories()->max('order') ?? 0;

        $wedding->budgetCategories()->create([
            ...$request->validated(),
            'order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Budget category created!');
    }

    public function updateCategory(UpdateBudgetCategoryRequest $request, Wedding $wedding, BudgetCategory $category): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $category->update($request->validated());

        return back()->with('success', 'Budget category updated!');
    }

    public function destroyCategory(Wedding $wedding, BudgetCategory $category): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $category->delete();

        return back()->with('success', 'Budget category deleted!');
    }

    public function storeItem(StoreBudgetItemRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $wedding->budgetItems()->create($request->validated());

        return back()->with('success', 'Budget item added!');
    }

    public function updateItem(UpdateBudgetItemRequest $request, Wedding $wedding, BudgetItem $item): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $item->update($request->validated());

        return back()->with('success', 'Budget item updated!');
    }

    public function destroyItem(Wedding $wedding, BudgetItem $item): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $item->delete();

        return back()->with('success', 'Budget item deleted!');
    }

    public function recordPayment(Request $request, Wedding $wedding, BudgetItem $item): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $newPaidAmount = ($item->paid_amount ?? 0) + $validated['amount'];
        $actualCost = $item->actual_cost ?? $item->estimated_cost ?? 0;

        $item->update([
            'paid_amount' => $newPaidAmount,
            'payment_method' => $validated['payment_method'],
            'is_paid' => $newPaidAmount >= $actualCost,
            'paid_date' => $newPaidAmount >= $actualCost ? now() : null,
            'payment_status' => $newPaidAmount >= $actualCost
                ? 'paid'
                : ($newPaidAmount > 0 ? 'partial' : 'pending'),
        ]);

        return back()->with('success', 'Payment recorded!');
    }

    public function updateBudget(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'total_budget' => 'required|numeric|min:0',
        ]);

        $wedding->update($validated);

        // Optionally recalculate category estimated amounts
        if ($request->recalculate_categories) {
            foreach ($wedding->budgetCategories as $category) {
                if ($category->percentage) {
                    $category->update([
                        'estimated_amount' => $wedding->total_budget * $category->percentage / 100,
                    ]);
                }
            }
        }

        return back()->with('success', 'Budget updated!');
    }

    public function report(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $categories = $wedding->budgetCategories()
            ->with('items')
            ->orderBy('order')
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'estimated' => $category->items->sum('estimated_cost'),
                    'actual' => $category->items->sum('actual_cost'),
                    'paid' => $category->items->sum('paid_amount'),
                    'items_count' => $category->items->count(),
                ];
            });

        $monthlySpending = $wedding->budgetItems()
            ->whereNotNull('paid_date')
            ->selectRaw("strftime('%Y-%m', paid_date) as month, SUM(paid_amount) as total")
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('weddings/budget/report', [
            'wedding' => $wedding,
            'categories' => $categories,
            'monthlySpending' => $monthlySpending,
            'summary' => [
                'total_budget' => $wedding->total_budget,
                'total_spent' => $wedding->budgetItems()->sum('actual_cost'),
                'total_paid' => $wedding->budgetItems()->sum('paid_amount'),
            ],
        ]);
    }
}
