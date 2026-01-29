<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function index(Request $request, Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $invitations = $wedding->invitations()
            ->with('guest')
            ->when($request->type, fn ($q, $type) => $q->where('type', $type))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->method, fn ($q, $method) => $q->where('delivery_method', $method))
            ->orderBy('created_at', 'desc')
            ->paginate(25)
            ->withQueryString();

        $stats = [
            'total' => $wedding->invitations()->count(),
            'pending' => $wedding->invitations()->where('status', 'pending')->count(),
            'sent' => $wedding->invitations()->where('status', 'sent')->count(),
            'delivered' => $wedding->invitations()->where('status', 'delivered')->count(),
            'returned' => $wedding->invitations()->where('status', 'returned')->count(),
        ];

        // Guests without invitations
        $guestsWithoutInvitations = $wedding->guests()
            ->whereDoesntHave('invitation')
            ->count();

        return Inertia::render('weddings/invitations/index', [
            'wedding' => $wedding,
            'invitations' => $invitations,
            'stats' => $stats,
            'guestsWithoutInvitations' => $guestsWithoutInvitations,
            'filters' => $request->only(['type', 'status', 'method']),
            'types' => Invitation::types(),
            'statuses' => Invitation::statuses(),
            'deliveryMethods' => Invitation::deliveryMethods(),
        ]);
    }

    public function create(Wedding $wedding): Response
    {
        $this->authorize('update', $wedding);

        $guestsWithoutInvitations = $wedding->guests()
            ->whereDoesntHave('invitation')
            ->orderBy('last_name')
            ->get();

        return Inertia::render('weddings/invitations/create', [
            'wedding' => $wedding,
            'guests' => $guestsWithoutInvitations,
            'types' => Invitation::types(),
            'deliveryMethods' => Invitation::deliveryMethods(),
        ]);
    }

    public function store(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'guest_ids' => 'required|array',
            'guest_ids.*' => 'exists:guests,id',
            'type' => 'required|in:save_the_date,formal,rehearsal_dinner,bridal_shower,bachelor_party,bachelorette_party,thank_you',
            'delivery_method' => 'required|in:mail,email,hand_delivered',
        ]);

        $created = 0;
        foreach ($validated['guest_ids'] as $guestId) {
            $guest = Guest::find($guestId);

            // Check if invitation of this type already exists
            $exists = $wedding->invitations()
                ->where('guest_id', $guestId)
                ->where('type', $validated['type'])
                ->exists();

            if (!$exists) {
                $wedding->invitations()->create([
                    'guest_id' => $guestId,
                    'type' => $validated['type'],
                    'delivery_method' => $validated['delivery_method'],
                    'status' => 'pending',
                    'address_used' => $guest->full_address,
                ]);
                $created++;
            }
        }

        return redirect()
            ->route('weddings.invitations.index', $wedding)
            ->with('success', "{$created} invitations created!");
    }

    public function update(Request $request, Wedding $wedding, Invitation $invitation): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'type' => 'sometimes|in:save_the_date,formal,rehearsal_dinner,bridal_shower,bachelor_party,bachelorette_party,thank_you',
            'delivery_method' => 'sometimes|in:mail,email,hand_delivered',
            'status' => 'sometimes|in:pending,sent,delivered,returned',
            'tracking_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Auto-set dates based on status
        if (isset($validated['status'])) {
            if ($validated['status'] === 'sent' && !$invitation->sent_date) {
                $validated['sent_date'] = now();
            }
            if ($validated['status'] === 'delivered' && !$invitation->delivered_date) {
                $validated['delivered_date'] = now();
            }
        }

        $invitation->update($validated);

        return back()->with('success', 'Invitation updated!');
    }

    public function destroy(Wedding $wedding, Invitation $invitation): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $invitation->delete();

        return back()->with('success', 'Invitation removed!');
    }

    public function markSent(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'invitation_ids' => 'required|array',
            'invitation_ids.*' => 'exists:invitations,id',
        ]);

        Invitation::whereIn('id', $validated['invitation_ids'])
            ->where('wedding_id', $wedding->id)
            ->update([
                'status' => 'sent',
                'sent_date' => now(),
            ]);

        return back()->with('success', 'Invitations marked as sent!');
    }

    public function addressLabels(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $invitations = $wedding->invitations()
            ->with('guest')
            ->where('delivery_method', 'mail')
            ->whereIn('status', ['pending', 'sent'])
            ->orderBy('created_at')
            ->get();

        return Inertia::render('weddings/invitations/address-labels', [
            'wedding' => $wedding,
            'invitations' => $invitations,
        ]);
    }

    public function createForAllGuests(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'type' => 'required|in:save_the_date,formal,rehearsal_dinner,bridal_shower,bachelor_party,bachelorette_party,thank_you',
            'delivery_method' => 'required|in:mail,email,hand_delivered',
        ]);

        $guests = $wedding->guests()
            ->whereDoesntHave('invitation', function ($q) use ($validated) {
                $q->where('type', $validated['type']);
            })
            ->get();

        $created = 0;
        foreach ($guests as $guest) {
            $wedding->invitations()->create([
                'guest_id' => $guest->id,
                'type' => $validated['type'],
                'delivery_method' => $validated['delivery_method'],
                'status' => 'pending',
                'address_used' => $guest->full_address,
            ]);
            $created++;
        }

        return back()->with('success', "{$created} invitations created for all guests!");
    }
}
