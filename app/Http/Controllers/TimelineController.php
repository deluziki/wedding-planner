<?php

namespace App\Http\Controllers;

use App\Http\Requests\Timeline\StoreTimelineEventRequest;
use App\Http\Requests\Timeline\UpdateTimelineEventRequest;
use App\Models\TimelineEvent;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimelineController extends Controller
{
    public function index(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $events = $wedding->timelineEvents()
            ->with(['venue', 'vendor'])
            ->orderBy('start_time')
            ->orderBy('order')
            ->get();

        return Inertia::render('weddings/timeline/index', [
            'wedding' => $wedding,
            'events' => $events,
            'types' => TimelineEvent::types(),
            'venues' => $wedding->venues()->get(),
            'vendors' => $wedding->vendors()->where('status', 'booked')->get(),
        ]);
    }

    public function store(StoreTimelineEventRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $maxOrder = $wedding->timelineEvents()->max('order') ?? 0;

        $wedding->timelineEvents()->create([
            ...$request->validated(),
            'order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Timeline event added!');
    }

    public function update(UpdateTimelineEventRequest $request, Wedding $wedding, TimelineEvent $event): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $event->update($request->validated());

        return back()->with('success', 'Timeline event updated!');
    }

    public function destroy(Wedding $wedding, TimelineEvent $event): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $event->delete();

        return back()->with('success', 'Timeline event removed!');
    }

    public function reorder(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'events' => 'required|array',
            'events.*.id' => 'required|exists:timeline_events,id',
            'events.*.order' => 'required|integer',
        ]);

        foreach ($validated['events'] as $eventData) {
            TimelineEvent::where('id', $eventData['id'])
                ->where('wedding_id', $wedding->id)
                ->update(['order' => $eventData['order']]);
        }

        return back()->with('success', 'Timeline reordered!');
    }

    public function generateDefault(Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        // Clear existing timeline
        $wedding->timelineEvents()->delete();

        $defaultTimeline = TimelineEvent::defaultTimeline();
        $order = 0;

        foreach ($defaultTimeline as $event) {
            $wedding->timelineEvents()->create([
                ...$event,
                'order' => ++$order,
            ]);
        }

        return back()->with('success', 'Default timeline generated!');
    }

    public function print(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $events = $wedding->timelineEvents()
            ->with(['venue', 'vendor'])
            ->orderBy('start_time')
            ->get();

        return Inertia::render('weddings/timeline/print', [
            'wedding' => $wedding,
            'events' => $events,
        ]);
    }
}
