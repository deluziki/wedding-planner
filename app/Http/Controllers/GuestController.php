<?php

namespace App\Http\Controllers;

use App\Http\Requests\Guest\StoreGuestRequest;
use App\Http\Requests\Guest\UpdateGuestRequest;
use App\Models\Guest;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuestController extends Controller
{
    public function index(Request $request, Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $guests = $wedding->guests()
            ->with('seatingTable')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->group, fn ($q, $group) => $q->where('group', $group))
            ->when($request->side, fn ($q, $side) => $q->where('side', $side))
            ->when($request->rsvp_status, fn ($q, $status) => $q->where('rsvp_status', $status))
            ->orderBy($request->sort ?? 'last_name', $request->direction ?? 'asc')
            ->paginate(25)
            ->withQueryString();

        $stats = [
            'total' => $wedding->guests()->count(),
            'confirmed' => $wedding->guests()->where('rsvp_status', 'confirmed')->count(),
            'declined' => $wedding->guests()->where('rsvp_status', 'declined')->count(),
            'pending' => $wedding->guests()->where('rsvp_status', 'pending')->count(),
            'total_attending' => $wedding->guests()
                ->where('rsvp_status', 'confirmed')
                ->selectRaw('SUM(1 + plus_one_count) as total')
                ->value('total') ?? 0,
        ];

        return Inertia::render('weddings/guests/index', [
            'wedding' => $wedding,
            'guests' => $guests,
            'stats' => $stats,
            'filters' => $request->only(['search', 'group', 'side', 'rsvp_status', 'sort', 'direction']),
            'groups' => Guest::groups(),
            'rsvpStatuses' => Guest::rsvpStatuses(),
        ]);
    }

    public function create(Wedding $wedding): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/guests/create', [
            'wedding' => $wedding,
            'groups' => Guest::groups(),
            'rsvpStatuses' => Guest::rsvpStatuses(),
            'tables' => $wedding->seatingTables()->orderBy('name')->get(),
        ]);
    }

    public function store(StoreGuestRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $wedding->guests()->create($request->validated());

        return redirect()
            ->route('weddings.guests.index', $wedding)
            ->with('success', 'Guest added successfully!');
    }

    public function show(Wedding $wedding, Guest $guest): Response
    {
        $this->authorize('view', $wedding);

        $guest->load(['seatingTable', 'invitation', 'gifts', 'accommodations.accommodation']);

        return Inertia::render('weddings/guests/show', [
            'wedding' => $wedding,
            'guest' => $guest,
        ]);
    }

    public function edit(Wedding $wedding, Guest $guest): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/guests/edit', [
            'wedding' => $wedding,
            'guest' => $guest,
            'groups' => Guest::groups(),
            'rsvpStatuses' => Guest::rsvpStatuses(),
            'tables' => $wedding->seatingTables()->orderBy('name')->get(),
        ]);
    }

    public function update(UpdateGuestRequest $request, Wedding $wedding, Guest $guest): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $guest->update($request->validated());

        return redirect()
            ->route('weddings.guests.index', $wedding)
            ->with('success', 'Guest updated successfully!');
    }

    public function destroy(Wedding $wedding, Guest $guest): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $guest->delete();

        return redirect()
            ->route('weddings.guests.index', $wedding)
            ->with('success', 'Guest removed successfully!');
    }

    public function updateRsvp(Request $request, Wedding $wedding, Guest $guest): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'rsvp_status' => 'required|in:pending,confirmed,declined,maybe',
            'plus_one_count' => 'nullable|integer|min:0',
            'meal_choice' => 'nullable|string',
            'dietary_restrictions' => 'nullable|array',
        ]);

        $guest->update([
            ...$validated,
            'rsvp_date' => now(),
        ]);

        return back()->with('success', 'RSVP updated successfully!');
    }

    public function import(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        // Process CSV import
        $file = $request->file('file');
        $handle = fopen($file->getPathname(), 'r');
        $header = fgetcsv($handle);

        $imported = 0;
        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);
            $wedding->guests()->create([
                'first_name' => $data['first_name'] ?? $data['First Name'] ?? '',
                'last_name' => $data['last_name'] ?? $data['Last Name'] ?? '',
                'email' => $data['email'] ?? $data['Email'] ?? null,
                'phone' => $data['phone'] ?? $data['Phone'] ?? null,
                'group' => $data['group'] ?? 'other',
                'side' => $data['side'] ?? null,
            ]);
            $imported++;
        }

        fclose($handle);

        return back()->with('success', "{$imported} guests imported successfully!");
    }

    public function export(Wedding $wedding)
    {
        $this->authorize('view', $wedding);

        $guests = $wedding->guests()->orderBy('last_name')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="guests.csv"',
        ];

        $callback = function () use ($guests) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['First Name', 'Last Name', 'Email', 'Phone', 'Group', 'Side', 'RSVP Status', 'Plus Ones', 'Meal Choice', 'Dietary Restrictions']);

            foreach ($guests as $guest) {
                fputcsv($file, [
                    $guest->first_name,
                    $guest->last_name,
                    $guest->email,
                    $guest->phone,
                    $guest->group,
                    $guest->side,
                    $guest->rsvp_status,
                    $guest->plus_one_count,
                    $guest->meal_choice,
                    implode(', ', $guest->dietary_restrictions ?? []),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
