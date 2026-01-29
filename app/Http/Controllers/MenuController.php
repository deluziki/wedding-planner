<?php

namespace App\Http\Controllers;

use App\Http\Requests\Menu\StoreMenuItemRequest;
use App\Http\Requests\Menu\StoreMenuRequest;
use App\Http\Requests\Menu\UpdateMenuItemRequest;
use App\Http\Requests\Menu\UpdateMenuRequest;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $menus = $wedding->menus()
            ->with(['items' => fn ($q) => $q->orderBy('order')])
            ->orderBy('order')
            ->get();

        // Get dietary requirements summary from guests
        $dietaryRequirements = $wedding->guests()
            ->where('rsvp_status', 'confirmed')
            ->whereNotNull('dietary_restrictions')
            ->get()
            ->pluck('dietary_restrictions')
            ->flatten()
            ->countBy();

        $mealChoices = $wedding->guests()
            ->where('rsvp_status', 'confirmed')
            ->whereNotNull('meal_choice')
            ->groupBy('meal_choice')
            ->selectRaw('meal_choice, count(*) as count')
            ->pluck('count', 'meal_choice');

        return Inertia::render('weddings/menus/index', [
            'wedding' => $wedding,
            'menus' => $menus,
            'dietaryRequirements' => $dietaryRequirements,
            'mealChoices' => $mealChoices,
            'types' => Menu::types(),
            'courses' => MenuItem::courses(),
            'dietaryOptions' => MenuItem::dietaryOptions(),
        ]);
    }

    public function store(StoreMenuRequest $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $maxOrder = $wedding->menus()->max('order') ?? 0;

        $wedding->menus()->create([
            ...$request->validated(),
            'order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Menu created!');
    }

    public function update(UpdateMenuRequest $request, Wedding $wedding, Menu $menu): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $menu->update($request->validated());

        return back()->with('success', 'Menu updated!');
    }

    public function destroy(Wedding $wedding, Menu $menu): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $menu->delete();

        return back()->with('success', 'Menu deleted!');
    }

    public function storeItem(StoreMenuItemRequest $request, Wedding $wedding, Menu $menu): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $maxOrder = $menu->items()->max('order') ?? 0;

        $menu->items()->create([
            ...$request->validated(),
            'order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Menu item added!');
    }

    public function updateItem(UpdateMenuItemRequest $request, Wedding $wedding, MenuItem $item): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $item->update($request->validated());

        return back()->with('success', 'Menu item updated!');
    }

    public function destroyItem(Wedding $wedding, MenuItem $item): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $item->delete();

        return back()->with('success', 'Menu item removed!');
    }

    public function reorderItems(Request $request, Wedding $wedding, Menu $menu): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:menu_items,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $itemData) {
            MenuItem::where('id', $itemData['id'])
                ->where('menu_id', $menu->id)
                ->update(['order' => $itemData['order']]);
        }

        return back()->with('success', 'Menu items reordered!');
    }

    public function reorderMenus(Request $request, Wedding $wedding): RedirectResponse
    {
        $this->authorize('update', $wedding);

        $validated = $request->validate([
            'menus' => 'required|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.order' => 'required|integer',
        ]);

        foreach ($validated['menus'] as $menuData) {
            Menu::where('id', $menuData['id'])
                ->where('wedding_id', $wedding->id)
                ->update(['order' => $menuData['order']]);
        }

        return back()->with('success', 'Menus reordered!');
    }

    public function print(Wedding $wedding): Response
    {
        $this->authorize('view', $wedding);

        $menus = $wedding->menus()
            ->where('is_active', true)
            ->with(['items' => fn ($q) => $q->where('is_available', true)->orderBy('order')])
            ->orderBy('order')
            ->get();

        return Inertia::render('weddings/menus/print', [
            'wedding' => $wedding,
            'menus' => $menus,
        ]);
    }
}
