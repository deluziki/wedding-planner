<?php

namespace App\Http\Controllers;

use App\Http\Requests\MarriageCertificate\StoreMarriageCertificateRequest;
use App\Http\Requests\MarriageCertificate\UpdateMarriageCertificateRequest;
use App\Models\MarriageCertificate;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarriageCertificateController extends Controller
{
    public function show(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $certificate = $wedding->marriageCertificate;

        // If no certificate exists, show create form
        if (!$certificate) {
            return Inertia::render('weddings/certificate/create', [
                'wedding' => $wedding,
                'statuses' => MarriageCertificate::statuses(),
                'defaultRequirements' => MarriageCertificate::defaultRequirements(),
            ]);
        }

        return Inertia::render('weddings/certificate/show', [
            'wedding' => $wedding,
            'certificate' => $certificate,
            'statuses' => MarriageCertificate::statuses(),
        ]);
    }

    public function store(StoreMarriageCertificateRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        // Only one certificate per wedding
        if ($wedding->marriageCertificate) {
            return back()->with('error', 'Marriage certificate already exists!');
        }

        $data = $request->validated();

        // Set default requirements if not provided
        if (!isset($data['requirements_checklist'])) {
            $data['requirements_checklist'] = MarriageCertificate::defaultRequirements();
        }

        $wedding->marriageCertificate()->create($data);

        return redirect()
            ->route('weddings.certificate.show', $wedding)
            ->with('success', 'Marriage certificate information saved!');
    }

    public function update(UpdateMarriageCertificateRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $certificate = $wedding->marriageCertificate;

        if (!$certificate) {
            return back()->with('error', 'No certificate found!');
        }

        $certificate->update($request->validated());

        return back()->with('success', 'Marriage certificate updated!');
    }

    public function updateStatus(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'status' => 'required|in:pending,applied,received,filed',
        ]);

        $certificate = $wedding->marriageCertificate;

        if (!$certificate) {
            return back()->with('error', 'No certificate found!');
        }

        $data = ['status' => $validated['status']];

        // Auto-set dates based on status
        if ($validated['status'] === 'applied' && !$certificate->application_date) {
            $data['application_date'] = now();
        }
        if ($validated['status'] === 'received' && !$certificate->received_date) {
            $data['received_date'] = now();
        }

        $certificate->update($data);

        return back()->with('success', 'Status updated!');
    }

    public function updateRequirement(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'index' => 'required|integer|min:0',
            'completed' => 'required|boolean',
        ]);

        $certificate = $wedding->marriageCertificate;

        if (!$certificate) {
            return back()->with('error', 'No certificate found!');
        }

        $checklist = $certificate->requirements_checklist ?? [];

        if (isset($checklist[$validated['index']])) {
            $checklist[$validated['index']]['completed'] = $validated['completed'];
            $certificate->update(['requirements_checklist' => $checklist]);
        }

        return back()->with('success', 'Requirement updated!');
    }

    public function addRequirement(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'item' => 'required|string|max:255',
        ]);

        $certificate = $wedding->marriageCertificate;

        if (!$certificate) {
            return back()->with('error', 'No certificate found!');
        }

        $checklist = $certificate->requirements_checklist ?? [];
        $checklist[] = [
            'item' => $validated['item'],
            'completed' => false,
        ];

        $certificate->update(['requirements_checklist' => $checklist]);

        return back()->with('success', 'Requirement added!');
    }

    public function removeRequirement(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'index' => 'required|integer|min:0',
        ]);

        $certificate = $wedding->marriageCertificate;

        if (!$certificate) {
            return back()->with('error', 'No certificate found!');
        }

        $checklist = $certificate->requirements_checklist ?? [];

        if (isset($checklist[$validated['index']])) {
            array_splice($checklist, $validated['index'], 1);
            $certificate->update(['requirements_checklist' => array_values($checklist)]);
        }

        return back()->with('success', 'Requirement removed!');
    }

    public function destroy(Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $wedding->marriageCertificate?->delete();

        return redirect()
            ->route('weddings.certificate.show', $wedding)
            ->with('success', 'Certificate information deleted!');
    }
}
