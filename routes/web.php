<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        $weddings = $user->weddings()
            ->withCount('guests')
            ->orderBy('date')
            ->get()
            ->map(fn ($wedding) => [
                'id' => $wedding->id,
                'title' => $wedding->title,
                'date' => $wedding->date,
                'partner1_name' => $wedding->partner1_name,
                'partner2_name' => $wedding->partner2_name,
                'venue' => $wedding->venue,
                'guests_count' => $wedding->guests_count,
                'budget' => $wedding->budget,
            ]);

        $stats = [
            'total_weddings' => $weddings->count(),
            'upcoming_weddings' => $user->weddings()->where('date', '>=', now())->count(),
            'total_guests' => $user->weddings()->withCount('guests')->get()->sum('guests_count'),
            'total_budget' => $user->weddings()->sum('budget'),
        ];

        return Inertia::render('dashboard', [
            'weddings' => $weddings,
            'stats' => $stats,
        ]);
    })->name('dashboard');

    // Wedding routes
    require __DIR__.'/wedding.php';
});

require __DIR__.'/settings.php';
