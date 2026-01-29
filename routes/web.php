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
            ->orderBy('wedding_date')
            ->get()
            ->map(fn ($wedding) => [
                'id' => $wedding->id,
                'title' => $wedding->title,
                'date' => $wedding->wedding_date,
                'partner1_name' => $wedding->bride_name,
                'partner2_name' => $wedding->groom_name,
                'guests_count' => $wedding->guests_count,
                'budget' => $wedding->total_budget ?? 0,
            ]);

        $stats = [
            'total_weddings' => $weddings->count(),
            'upcoming_weddings' => $user->weddings()->where('wedding_date', '>=', now())->count(),
            'total_guests' => $user->weddings()->withCount('guests')->get()->sum('guests_count'),
            'total_budget' => $user->weddings()->sum('total_budget') ?? 0,
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
