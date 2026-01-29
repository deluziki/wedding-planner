<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vendor\StoreVendorRequest;
use App\Http\Requests\Vendor\UpdateVendorRequest;
use App\Models\Vendor;
use App\Models\VendorCategory;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(Request $request, Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $vendors = $wedding->vendors()
            ->with('category')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('company_name', 'like', "%{$search}%");
                });
            })
            ->when($request->category, fn ($q, $cat) => $q->where('vendor_category_id', $cat))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'total' => $wedding->vendors()->count(),
            'booked' => $wedding->vendors()->where('status', 'booked')->count(),
            'considering' => $wedding->vendors()->where('status', 'considering')->count(),
            'total_cost' => $wedding->vendors()->where('status', 'booked')->sum('final_price'),
            'total_paid' => $wedding->vendors()
                ->where('status', 'booked')
                ->where('deposit_paid', true)
                ->sum('deposit_amount'),
        ];

        return Inertia::render('weddings/vendors/index', [
            'wedding' => $wedding,
            'vendors' => $vendors,
            'stats' => $stats,
            'filters' => $request->only(['search', 'category', 'status']),
            'categories' => VendorCategory::orderBy('order')->get(),
            'statuses' => Vendor::statuses(),
        ]);
    }

    public function create(Wedding $wedding): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/vendors/create', [
            'wedding' => $wedding,
            'categories' => VendorCategory::orderBy('order')->get(),
            'statuses' => Vendor::statuses(),
        ]);
    }

    public function store(StoreVendorRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $wedding->vendors()->create($request->validated());

        return redirect()
            ->route('weddings.vendors.index', $wedding)
            ->with('success', 'Vendor added successfully!');
    }

    public function show(Wedding $wedding, Vendor $vendor): Response
    {
        $this->authorize('view', $wedding);

        $vendor->load(['category', 'budgetItems', 'timelineEvents']);

        return Inertia::render('weddings/vendors/show', [
            'wedding' => $wedding,
            'vendor' => $vendor,
        ]);
    }

    public function edit(Wedding $wedding, Vendor $vendor): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/vendors/edit', [
            'wedding' => $wedding,
            'vendor' => $vendor,
            'categories' => VendorCategory::orderBy('order')->get(),
            'statuses' => Vendor::statuses(),
        ]);
    }

    public function update(UpdateVendorRequest $request, Wedding $wedding, Vendor $vendor): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $vendor->update($request->validated());

        return redirect()
            ->route('weddings.vendors.show', [$wedding, $vendor])
            ->with('success', 'Vendor updated successfully!');
    }

    public function destroy(Wedding $wedding, Vendor $vendor): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $vendor->delete();

        return redirect()
            ->route('weddings.vendors.index', $wedding)
            ->with('success', 'Vendor removed successfully!');
    }

    public function updateStatus(Request $request, Wedding $wedding, Vendor $vendor): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'status' => 'required|in:considering,contacted,booked,declined,cancelled',
        ]);

        $vendor->update($validated);

        return back()->with('success', 'Vendor status updated!');
    }

    public function recordPayment(Request $request, Wedding $wedding, Vendor $vendor): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'type' => 'required|in:deposit,balance',
            'paid' => 'required|boolean',
            'date' => 'nullable|date',
        ]);

        if ($validated['type'] === 'deposit') {
            $vendor->update([
                'deposit_paid' => $validated['paid'],
            ]);
        } else {
            $vendor->update([
                'balance_paid' => $validated['paid'],
            ]);
        }

        return back()->with('success', 'Payment recorded successfully!');
    }
}
