<?php

namespace App\Http\Controllers;

use App\Http\Requests\Accommodation\StoreAccommodationRequest;
use App\Http\Requests\Accommodation\UpdateAccommodationRequest;
use App\Models\Accommodation;
use App\Models\GuestAccommodation;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccommodationController extends Controller
{
    public function index(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $accommodations = $wedding->accommodations()
            ->withCount('guestAccommodations')
            ->orderBy('is_primary', 'desc')
            ->orderBy('hotel_name')
            ->get();

        $stats = [
            'total_hotels' => $accommodations->count(),
            'total_rooms_blocked' => $accommodations->sum('rooms_blocked'),
            'total_rooms_booked' => $accommodations->sum('rooms_booked'),
        ];

        return Inertia::render('weddings/accommodations/index', [
            'wedding' => $wedding,
            'accommodations' => $accommodations,
            'stats' => $stats,
        ]);
    }

    public function create(Wedding $wedding): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/accommodations/create', [
            'wedding' => $wedding,
        ]);
    }

    public function store(StoreAccommodationRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        if ($request->is_primary) {
            $wedding->accommodations()->update(['is_primary' => false]);
        }

        $wedding->accommodations()->create($request->validated());

        return redirect()
            ->route('weddings.accommodations.index', $wedding)
            ->with('success', 'Accommodation added!');
    }

    public function show(Wedding $wedding, Accommodation $accommodation): Response
    {
        $this->authorize('view', $wedding);

        $accommodation->load('guestAccommodations.guest');

        return Inertia::render('weddings/accommodations/show', [
            'wedding' => $wedding,
            'accommodation' => $accommodation,
            'availableGuests' => $wedding->guests()
                ->whereDoesntHave('accommodations', fn ($q) => $q->where('accommodation_id', $accommodation->id))
                ->where('rsvp_status', 'confirmed')
                ->orderBy('last_name')
                ->get(),
        ]);
    }

    public function edit(Wedding $wedding, Accommodation $accommodation): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/accommodations/edit', [
            'wedding' => $wedding,
            'accommodation' => $accommodation,
        ]);
    }

    public function update(UpdateAccommodationRequest $request, Wedding $wedding, Accommodation $accommodation): RedirectResponse
    {
        $this->authorize('update', $wedding);

        if ($request->is_primary) {
            $wedding->accommodations()->where('id', '!=', $accommodation->id)->update(['is_primary' => false]);
        }

        $accommodation->update($request->validated());

        return redirect()
            ->route('weddings.accommodations.show', [$wedding, $accommodation])
            ->with('success', 'Accommodation updated!');
    }

    public function destroy(Wedding $wedding, Accommodation $accommodation): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $accommodation->delete();

        return redirect()
            ->route('weddings.accommodations.index', $wedding)
            ->with('success', 'Accommodation removed!');
    }

    public function addGuest(Request $request, Wedding $wedding, Accommodation $accommodation): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'check_in_date' => 'nullable|date',
            'check_out_date' => 'nullable|date|after_or_equal:check_in_date',
            'room_type' => 'nullable|string|max:255',
            'confirmation_number' => 'nullable|string|max:255',
            'special_requests' => 'nullable|string',
        ]);

        // Check if guest already has this accommodation
        $exists = GuestAccommodation::where('guest_id', $validated['guest_id'])
            ->where('accommodation_id', $accommodation->id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Guest already added to this accommodation!');
        }

        GuestAccommodation::create([
            ...$validated,
            'accommodation_id' => $accommodation->id,
        ]);

        // Update rooms booked count
        $accommodation->increment('rooms_booked');

        return back()->with('success', 'Guest added to accommodation!');
    }

    public function removeGuest(Wedding $wedding, Accommodation $accommodation, GuestAccommodation $guestAccommodation): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $guestAccommodation->delete();
        $accommodation->decrement('rooms_booked');

        return back()->with('success', 'Guest removed from accommodation!');
    }

    public function updateGuestAccommodation(Request $request, Wedding $wedding, GuestAccommodation $guestAccommodation): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'check_in_date' => 'nullable|date',
            'check_out_date' => 'nullable|date|after_or_equal:check_in_date',
            'room_type' => 'nullable|string|max:255',
            'confirmation_number' => 'nullable|string|max:255',
            'special_requests' => 'nullable|string',
        ]);

        $guestAccommodation->update($validated);

        return back()->with('success', 'Accommodation details updated!');
    }
}
