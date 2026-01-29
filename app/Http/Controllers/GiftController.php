<?php

namespace App\Http\Controllers;

use App\Http\Requests\Gift\StoreGiftRequest;
use App\Http\Requests\Gift\StoreGiftRegistryRequest;
use App\Http\Requests\Gift\UpdateGiftRequest;
use App\Models\Gift;
use App\Models\GiftRegistry;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GiftController extends Controller
{
    public function index(Request $request, Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $registries = $wedding->giftRegistries()->orderBy('is_primary', 'desc')->get();

        $gifts = $wedding->gifts()
            ->with(['guest', 'registry'])
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->when($request->thank_you === 'pending', fn ($q) => $q->where('thank_you_sent', false))
            ->when($request->thank_you === 'sent', fn ($q) => $q->where('thank_you_sent', true))
            ->orderBy('received_date', 'desc')
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'total_gifts' => $wedding->gifts()->count(),
            'total_value' => $wedding->gifts()->sum('value'),
            'thank_you_pending' => $wedding->gifts()->where('thank_you_sent', false)->count(),
            'thank_you_sent' => $wedding->gifts()->where('thank_you_sent', true)->count(),
        ];

        return Inertia::render('weddings/gifts/index', [
            'wedding' => $wedding,
            'registries' => $registries,
            'gifts' => $gifts,
            'stats' => $stats,
            'filters' => $request->only(['search', 'thank_you']),
            'statuses' => Gift::statuses(),
            'guests' => $wedding->guests()->orderBy('last_name')->get(['id', 'first_name', 'last_name']),
        ]);
    }

    public function storeRegistry(StoreGiftRegistryRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        // If this is set as primary, unset others
        if ($request->is_primary) {
            $wedding->giftRegistries()->update(['is_primary' => false]);
        }

        $wedding->giftRegistries()->create($request->validated());

        return back()->with('success', 'Gift registry added!');
    }

    public function updateRegistry(Request $request, Wedding $wedding, GiftRegistry $registry): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'registry_url' => 'nullable|url|max:255',
            'registry_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'is_primary' => 'boolean',
        ]);

        if ($validated['is_primary'] ?? false) {
            $wedding->giftRegistries()->where('id', '!=', $registry->id)->update(['is_primary' => false]);
        }

        $registry->update($validated);

        return back()->with('success', 'Registry updated!');
    }

    public function destroyRegistry(Wedding $wedding, GiftRegistry $registry): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $registry->delete();

        return back()->with('success', 'Registry removed!');
    }

    public function store(StoreGiftRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $wedding->gifts()->create($request->validated());

        return back()->with('success', 'Gift recorded!');
    }

    public function update(UpdateGiftRequest $request, Wedding $wedding, Gift $gift): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $gift->update($request->validated());

        return back()->with('success', 'Gift updated!');
    }

    public function destroy(Wedding $wedding, Gift $gift): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $gift->delete();

        return back()->with('success', 'Gift removed!');
    }

    public function markThankYouSent(Request $request, Wedding $wedding, Gift $gift): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $gift->update([
            'thank_you_sent' => true,
            'thank_you_date' => now(),
        ]);

        return back()->with('success', 'Thank you marked as sent!');
    }

    public function bulkThankYou(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'gift_ids' => 'required|array',
            'gift_ids.*' => 'exists:gifts,id',
        ]);

        Gift::whereIn('id', $validated['gift_ids'])
            ->where('wedding_id', $wedding->id)
            ->update([
                'thank_you_sent' => true,
                'thank_you_date' => now(),
            ]);

        return back()->with('success', 'Thank you notes marked as sent!');
    }

    public function thankYouList(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $pendingThankYous = $wedding->gifts()
            ->with('guest')
            ->where('thank_you_sent', false)
            ->orderBy('received_date')
            ->get();

        return Inertia::render('weddings/gifts/thank-you-list', [
            'wedding' => $wedding,
            'pendingThankYous' => $pendingThankYous,
        ]);
    }
}
