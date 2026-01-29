<?php

namespace App\Http\Controllers;

use App\Http\Requests\Seating\StoreSeatingTableRequest;
use App\Http\Requests\Seating\UpdateSeatingTableRequest;
use App\Models\Guest;
use App\Models\SeatingTable;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeatingController extends Controller
{
    public function index(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $tables = $wedding->seatingTables()
            ->with('guests')
            ->orderBy('order')
            ->get();

        $unassignedGuests = $wedding->guests()
            ->whereNull('table_id')
            ->where('rsvp_status', 'confirmed')
            ->orderBy('last_name')
            ->get();

        $stats = [
            'total_tables' => $tables->count(),
            'total_capacity' => $tables->sum('capacity'),
            'total_seated' => $tables->sum(fn ($t) => $t->guests->count()),
            'unassigned_count' => $unassignedGuests->count(),
        ];

        return Inertia::render('weddings/seating/index', [
            'wedding' => $wedding,
            'tables' => $tables,
            'unassignedGuests' => $unassignedGuests,
            'stats' => $stats,
            'shapes' => SeatingTable::shapes(),
        ]);
    }

    public function store(StoreSeatingTableRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $maxOrder = $wedding->seatingTables()->max('order') ?? 0;

        $wedding->seatingTables()->create([
            ...$request->validated(),
            'order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Table added!');
    }

    public function update(UpdateSeatingTableRequest $request, Wedding $wedding, SeatingTable $table): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $table->update($request->validated());

        return back()->with('success', 'Table updated!');
    }

    public function destroy(Wedding $wedding, SeatingTable $table): RedirectResponse
    {
        $this->authorize('update', $wedding);

        // Unassign guests from this table
        $table->guests()->update(['table_id' => null, 'seat_number' => null]);
        $table->delete();

        return back()->with('success', 'Table removed!');
    }

    public function assignGuest(Request $request, Wedding $wedding, SeatingTable $table): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'seat_number' => 'nullable|integer|min:1',
        ]);

        $guest = Guest::findOrFail($validated['guest_id']);

        // Check if table is full
        if ($table->guests()->count() >= $table->capacity) {
            return back()->with('error', 'Table is full!');
        }

        $guest->update([
            'table_id' => $table->id,
            'seat_number' => $validated['seat_number'],
        ]);

        return back()->with('success', 'Guest assigned to table!');
    }

    public function unassignGuest(Wedding $wedding, Guest $guest): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $guest->update([
            'table_id' => null,
            'seat_number' => null,
        ]);

        return back()->with('success', 'Guest removed from table!');
    }

    public function autoAssign(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'strategy' => 'required|in:group,side,random',
        ]);

        $unassignedGuests = $wedding->guests()
            ->whereNull('table_id')
            ->where('rsvp_status', 'confirmed')
            ->get();

        if ($validated['strategy'] === 'group') {
            $unassignedGuests = $unassignedGuests->sortBy('group');
        } elseif ($validated['strategy'] === 'side') {
            $unassignedGuests = $unassignedGuests->sortBy('side');
        } else {
            $unassignedGuests = $unassignedGuests->shuffle();
        }

        $tables = $wedding->seatingTables()
            ->withCount('guests')
            ->orderBy('order')
            ->get();

        foreach ($unassignedGuests as $guest) {
            foreach ($tables as $table) {
                if ($table->guests_count < $table->capacity) {
                    $guest->update(['table_id' => $table->id]);
                    $table->guests_count++;
                    break;
                }
            }
        }

        return back()->with('success', 'Guests auto-assigned to tables!');
    }

    public function chart(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $tables = $wedding->seatingTables()
            ->with('guests')
            ->orderBy('order')
            ->get();

        return Inertia::render('weddings/seating/chart', [
            'wedding' => $wedding,
            'tables' => $tables,
            'shapes' => SeatingTable::shapes(),
        ]);
    }

    public function updatePositions(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'tables' => 'required|array',
            'tables.*.id' => 'required|exists:seating_tables,id',
            'tables.*.position_x' => 'required|numeric',
            'tables.*.position_y' => 'required|numeric',
        ]);

        foreach ($validated['tables'] as $tableData) {
            SeatingTable::where('id', $tableData['id'])
                ->where('wedding_id', $wedding->id)
                ->update([
                    'position_x' => $tableData['position_x'],
                    'position_y' => $tableData['position_y'],
                ]);
        }

        return back()->with('success', 'Table positions saved!');
    }
}
