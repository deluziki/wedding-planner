<?php

namespace App\Http\Controllers;

use App\Http\Requests\WeddingParty\StoreWeddingPartyMemberRequest;
use App\Http\Requests\WeddingParty\UpdateWeddingPartyMemberRequest;
use App\Models\Wedding;
use App\Models\WeddingPartyMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WeddingPartyController extends Controller
{
    public function index(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $members = $wedding->weddingPartyMembers()
            ->with('assignedTasks')
            ->orderBy('side')
            ->orderBy('order')
            ->get()
            ->groupBy('side');

        return Inertia::render('weddings/party/index', [
            'wedding' => $wedding,
            'brideParty' => $members->get('bride', collect()),
            'groomParty' => $members->get('groom', collect()),
            'roles' => WeddingPartyMember::roles(),
        ]);
    }

    public function create(Wedding $wedding): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/party/create', [
            'wedding' => $wedding,
            'roles' => WeddingPartyMember::roles(),
        ]);
    }

    public function store(StoreWeddingPartyMemberRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $maxOrder = $wedding->weddingPartyMembers()
            ->where('side', $request->side)
            ->max('order') ?? 0;

        $wedding->weddingPartyMembers()->create([
            ...$request->validated(),
            'order' => $maxOrder + 1,
        ]);

        return redirect()
            ->route('weddings.party.index', $wedding)
            ->with('success', 'Party member added successfully!');
    }

    public function show(Wedding $wedding, WeddingPartyMember $member): Response
    {
        $this->authorize('view', $wedding);

        $member->load('assignedTasks');

        return Inertia::render('weddings/party/show', [
            'wedding' => $wedding,
            'member' => $member,
        ]);
    }

    public function edit(Wedding $wedding, WeddingPartyMember $member): Response
    {
        $this->authorize('update', $wedding);

        return Inertia::render('weddings/party/edit', [
            'wedding' => $wedding,
            'member' => $member,
            'roles' => WeddingPartyMember::roles(),
        ]);
    }

    public function update(UpdateWeddingPartyMemberRequest $request, Wedding $wedding, WeddingPartyMember $member): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $member->update($request->validated());

        return redirect()
            ->route('weddings.party.index', $wedding)
            ->with('success', 'Party member updated successfully!');
    }

    public function destroy(Wedding $wedding, WeddingPartyMember $member): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $member->delete();

        return redirect()
            ->route('weddings.party.index', $wedding)
            ->with('success', 'Party member removed successfully!');
    }

    public function reorder(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'members' => 'required|array',
            'members.*.id' => 'required|exists:wedding_party_members,id',
            'members.*.order' => 'required|integer',
        ]);

        foreach ($validated['members'] as $memberData) {
            WeddingPartyMember::where('id', $memberData['id'])
                ->where('wedding_id', $wedding->id)
                ->update(['order' => $memberData['order']]);
        }

        return back()->with('success', 'Party members reordered!');
    }

    public function updateAttireStatus(Request $request, Wedding $wedding, WeddingPartyMember $member): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'attire_status' => 'required|in:pending,ordered,fitted,ready',
            'attire_details' => 'nullable|string',
            'attire_cost' => 'nullable|numeric|min:0',
        ]);

        $member->update($validated);

        return back()->with('success', 'Attire status updated!');
    }
}
