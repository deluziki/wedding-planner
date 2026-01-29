<?php

use App\Http\Controllers\AccommodationController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\MarriageCertificateController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\SeatingController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TimelineController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\WeddingController;
use App\Http\Controllers\WeddingPartyController;
use Illuminate\Support\Facades\Route;

// Weddings
Route::resource('weddings', WeddingController::class);
Route::get('weddings/{wedding}/dashboard', [WeddingController::class, 'dashboard'])->name('weddings.dashboard');

// Nested wedding resources
Route::prefix('weddings/{wedding}')->name('weddings.')->group(function () {
    // Guests
    Route::resource('guests', GuestController::class);
    Route::patch('guests/{guest}/rsvp', [GuestController::class, 'updateRsvp'])->name('guests.rsvp');
    Route::post('guests/import', [GuestController::class, 'import'])->name('guests.import');
    Route::get('guests-export', [GuestController::class, 'export'])->name('guests.export');

    // Vendors
    Route::resource('vendors', VendorController::class);
    Route::patch('vendors/{vendor}/status', [VendorController::class, 'updateStatus'])->name('vendors.status');
    Route::post('vendors/{vendor}/payment', [VendorController::class, 'recordPayment'])->name('vendors.payment');

    // Budget
    Route::get('budget', [BudgetController::class, 'index'])->name('budget.index');
    Route::post('budget/categories', [BudgetController::class, 'storeCategory'])->name('budget.categories.store');
    Route::patch('budget/categories/{category}', [BudgetController::class, 'updateCategory'])->name('budget.categories.update');
    Route::delete('budget/categories/{category}', [BudgetController::class, 'destroyCategory'])->name('budget.categories.destroy');
    Route::post('budget/items', [BudgetController::class, 'storeItem'])->name('budget.items.store');
    Route::patch('budget/items/{item}', [BudgetController::class, 'updateItem'])->name('budget.items.update');
    Route::delete('budget/items/{item}', [BudgetController::class, 'destroyItem'])->name('budget.items.destroy');
    Route::post('budget/items/{item}/payment', [BudgetController::class, 'recordPayment'])->name('budget.items.payment');
    Route::patch('budget/total', [BudgetController::class, 'updateBudget'])->name('budget.update');
    Route::get('budget/report', [BudgetController::class, 'report'])->name('budget.report');

    // Tasks
    Route::resource('tasks', TaskController::class);
    Route::patch('tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.status');
    Route::post('tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
    Route::get('checklist', [TaskController::class, 'checklist'])->name('tasks.checklist');
    Route::post('tasks/generate-defaults', [TaskController::class, 'generateDefaultTasks'])->name('tasks.generate-defaults');

    // Venues
    Route::resource('venues', VenueController::class);
    Route::patch('venues/{venue}/book', [VenueController::class, 'markBooked'])->name('venues.book');
    Route::patch('venues/{venue}/deposit', [VenueController::class, 'recordDeposit'])->name('venues.deposit');

    // Wedding Party
    Route::resource('party', WeddingPartyController::class)->parameters(['party' => 'member']);
    Route::post('party/reorder', [WeddingPartyController::class, 'reorder'])->name('party.reorder');
    Route::patch('party/{member}/attire', [WeddingPartyController::class, 'updateAttireStatus'])->name('party.attire');

    // Timeline
    Route::get('timeline', [TimelineController::class, 'index'])->name('timeline.index');
    Route::post('timeline', [TimelineController::class, 'store'])->name('timeline.store');
    Route::patch('timeline/{event}', [TimelineController::class, 'update'])->name('timeline.update');
    Route::delete('timeline/{event}', [TimelineController::class, 'destroy'])->name('timeline.destroy');
    Route::post('timeline/reorder', [TimelineController::class, 'reorder'])->name('timeline.reorder');
    Route::post('timeline/generate-default', [TimelineController::class, 'generateDefault'])->name('timeline.generate-default');
    Route::get('timeline/print', [TimelineController::class, 'print'])->name('timeline.print');

    // Seating
    Route::get('seating', [SeatingController::class, 'index'])->name('seating.index');
    Route::post('seating/tables', [SeatingController::class, 'store'])->name('seating.tables.store');
    Route::patch('seating/tables/{table}', [SeatingController::class, 'update'])->name('seating.tables.update');
    Route::delete('seating/tables/{table}', [SeatingController::class, 'destroy'])->name('seating.tables.destroy');
    Route::post('seating/tables/{table}/assign', [SeatingController::class, 'assignGuest'])->name('seating.assign');
    Route::delete('seating/guests/{guest}/unassign', [SeatingController::class, 'unassignGuest'])->name('seating.unassign');
    Route::post('seating/auto-assign', [SeatingController::class, 'autoAssign'])->name('seating.auto-assign');
    Route::get('seating/chart', [SeatingController::class, 'chart'])->name('seating.chart');
    Route::post('seating/positions', [SeatingController::class, 'updatePositions'])->name('seating.positions');

    // Gifts
    Route::get('gifts', [GiftController::class, 'index'])->name('gifts.index');
    Route::post('gifts/registries', [GiftController::class, 'storeRegistry'])->name('gifts.registries.store');
    Route::patch('gifts/registries/{registry}', [GiftController::class, 'updateRegistry'])->name('gifts.registries.update');
    Route::delete('gifts/registries/{registry}', [GiftController::class, 'destroyRegistry'])->name('gifts.registries.destroy');
    Route::post('gifts', [GiftController::class, 'store'])->name('gifts.store');
    Route::patch('gifts/{gift}', [GiftController::class, 'update'])->name('gifts.update');
    Route::delete('gifts/{gift}', [GiftController::class, 'destroy'])->name('gifts.destroy');
    Route::patch('gifts/{gift}/thank-you', [GiftController::class, 'markThankYouSent'])->name('gifts.thank-you');
    Route::post('gifts/bulk-thank-you', [GiftController::class, 'bulkThankYou'])->name('gifts.bulk-thank-you');
    Route::get('gifts/thank-you-list', [GiftController::class, 'thankYouList'])->name('gifts.thank-you-list');

    // Invitations
    Route::get('invitations', [InvitationController::class, 'index'])->name('invitations.index');
    Route::get('invitations/create', [InvitationController::class, 'create'])->name('invitations.create');
    Route::post('invitations', [InvitationController::class, 'store'])->name('invitations.store');
    Route::patch('invitations/{invitation}', [InvitationController::class, 'update'])->name('invitations.update');
    Route::delete('invitations/{invitation}', [InvitationController::class, 'destroy'])->name('invitations.destroy');
    Route::post('invitations/mark-sent', [InvitationController::class, 'markSent'])->name('invitations.mark-sent');
    Route::get('invitations/address-labels', [InvitationController::class, 'addressLabels'])->name('invitations.address-labels');
    Route::post('invitations/create-for-all', [InvitationController::class, 'createForAllGuests'])->name('invitations.create-for-all');

    // Marriage Certificate
    Route::get('certificate', [MarriageCertificateController::class, 'show'])->name('certificate.show');
    Route::post('certificate', [MarriageCertificateController::class, 'store'])->name('certificate.store');
    Route::patch('certificate', [MarriageCertificateController::class, 'update'])->name('certificate.update');
    Route::patch('certificate/status', [MarriageCertificateController::class, 'updateStatus'])->name('certificate.status');
    Route::patch('certificate/requirement', [MarriageCertificateController::class, 'updateRequirement'])->name('certificate.requirement');
    Route::post('certificate/requirement', [MarriageCertificateController::class, 'addRequirement'])->name('certificate.add-requirement');
    Route::delete('certificate/requirement', [MarriageCertificateController::class, 'removeRequirement'])->name('certificate.remove-requirement');
    Route::delete('certificate', [MarriageCertificateController::class, 'destroy'])->name('certificate.destroy');

    // Accommodations
    Route::resource('accommodations', AccommodationController::class);
    Route::post('accommodations/{accommodation}/guests', [AccommodationController::class, 'addGuest'])->name('accommodations.add-guest');
    Route::delete('accommodations/{accommodation}/guests/{guestAccommodation}', [AccommodationController::class, 'removeGuest'])->name('accommodations.remove-guest');
    Route::patch('accommodations/guest-accommodation/{guestAccommodation}', [AccommodationController::class, 'updateGuestAccommodation'])->name('accommodations.update-guest');

    // Menus
    Route::get('menus', [MenuController::class, 'index'])->name('menus.index');
    Route::post('menus', [MenuController::class, 'store'])->name('menus.store');
    Route::patch('menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
    Route::delete('menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');
    Route::post('menus/{menu}/items', [MenuController::class, 'storeItem'])->name('menus.items.store');
    Route::patch('menus/items/{item}', [MenuController::class, 'updateItem'])->name('menus.items.update');
    Route::delete('menus/items/{item}', [MenuController::class, 'destroyItem'])->name('menus.items.destroy');
    Route::post('menus/{menu}/items/reorder', [MenuController::class, 'reorderItems'])->name('menus.items.reorder');
    Route::post('menus/reorder', [MenuController::class, 'reorderMenus'])->name('menus.reorder');
    Route::get('menus/print', [MenuController::class, 'print'])->name('menus.print');
});
