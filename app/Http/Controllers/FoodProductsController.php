<?php

namespace App\Http\Controllers;

use App\Models\Meal;

class FoodProductsController extends Controller
{

	public function importFoodProducts()
	{
		$foodProducts = json_decode(file_get_contents('../../../database/FoodDB/openfoodfacts-products.jsonl'), true);
		dd($foodProducts);
		// foreach ($foodProducts as $foodProduct) {
		// 	$foodProduct['created_at'] = date('Y-m-d H:i:s');
		// 	$foodProduct['updated_at'] = date('Y-m-d H:i:s');
		// 	Meal::create($foodProduct);
		// }
	}
}
