<?php

namespace App\Http\Controllers;

use App\Http\Requests\Venue\StoreVenueRequest;
use App\Http\Requests\Venue\UpdateVenueRequest;
use App\Models\Venue;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    public function index(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $venues = $wedding->venues()
            ->orderBy('type')
            ->get();

        return Inertia::render('weddings/venues/index', [
            'wedding' => $wedding,
            'venues' => $venues,
        ]);
    }

    public function create(Wedding $wedding): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/venues/create', [
            'wedding' => $wedding,
            'types' => [
                'ceremony' => 'Ceremony',
                'reception' => 'Reception',
                'both' => 'Ceremony & Reception',
            ],
        ]);
    }

    public function store(StoreVenueRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $wedding->venues()->create($request->validated());

        return redirect()
            ->route('weddings.venues.index', $wedding)
            ->with('success', 'Venue added successfully!');
    }

    public function show(Wedding $wedding, Venue $venue): Response
    {
        $this->authorize('view', $wedding);

        $venue->load('timelineEvents');

        return Inertia::render('weddings/venues/show', [
            'wedding' => $wedding,
            'venue' => $venue,
        ]);
    }

    public function edit(Wedding $wedding, Venue $venue): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/venues/edit', [
            'wedding' => $wedding,
            'venue' => $venue,
            'types' => [
                'ceremony' => 'Ceremony',
                'reception' => 'Reception',
                'both' => 'Ceremony & Reception',
            ],
        ]);
    }

    public function update(UpdateVenueRequest $request, Wedding $wedding, Venue $venue): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $venue->update($request->validated());

        return redirect()
            ->route('weddings.venues.show', [$wedding, $venue])
            ->with('success', 'Venue updated successfully!');
    }

    public function destroy(Wedding $wedding, Venue $venue): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $venue->delete();

        return redirect()
            ->route('weddings.venues.index', $wedding)
            ->with('success', 'Venue removed successfully!');
    }

    public function markBooked(Request $request, Wedding $wedding, Venue $venue): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $venue->update([
            'is_booked' => true,
            'booking_date' => now(),
        ]);

        return back()->with('success', 'Venue marked as booked!');
    }

    public function recordDeposit(Request $request, Wedding $wedding, Venue $venue): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $venue->update([
            'deposit_paid' => true,
        ]);

        return back()->with('success', 'Deposit recorded!');
    }
}
