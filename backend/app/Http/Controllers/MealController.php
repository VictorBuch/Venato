<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use App\Models\QuickTrackMeal;
use Illuminate\Http\Request;

class MealController extends Controller
{

    public function deleteMeal(Request $request, $id)
    {
        $meal = Meal::find($id);
        $meal->delete();
        return response()->json(['message' => 'Meal deleted successfully']);
    }

    public function getMeals(Request $request)
    {
        $user = auth()->user();
        if ($request->has('id')) {
            $meals = Meal::where('id', $request->id)->first();
            if (!$meals) {
                $meals = QuickTrackMeal::where('id', $request->id)->first();
            }
            return response()->json($meals);
        } else {
            // TODO: make it also take into account the user's meal type
            $meals = Meal::all();
            $quickTrackMeals = QuickTrackMeal::all();
            // $consumedmeals = $user->consumedMeals;
            // $meals = $meals->filter(function ($meal) use ($consumedmeals) {
            //     return !($consumedmeals->contains('meal_id', $meal->id) && $meal->created_at->isToday());
            // });
            // $meals = Meal::whereNotIn('id', $user->consumedMeals->pluck('meal_id'))->get();
            return response()->json($meals->merge($quickTrackMeals));
        }
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
            $meal->saturated_fat = $request['saturated_fat'];
            $meal->sodium_mg = $request['sodium_mg'];
            $meal->potasium_g = $request['potasium_g'];
            $meal->cholesterol_mg = $request['cholesterol_mg'];
            $meal->save();
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
