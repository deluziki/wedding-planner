<?php

namespace Database\Seeders;

use App\Models\VendorCategory;
use Illuminate\Database\Seeder;

class VendorCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = VendorCategory::defaultCategories();

        foreach ($categories as $category) {
            VendorCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
