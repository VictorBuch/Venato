<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use Illuminate\Http\Request;

class MealController extends Controller
{

    public function getMeals()
    {
        return response()->json(Meal::all());
    }

    public function addMeal(Request $request)
    {
        try {
            $meal = new Meal();
            $meal->name = $request['name'];
            $meal->portion = $request['portion'];
            $meal->calories = $request['calories'];
            $meal->carbs = $request['carbs'];
            $meal->protein = $request['protein'];
            $meal->fat = $request['fat'];
            $meal->recipe_id = $request['recipe_id'];
            $meal->save();
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
