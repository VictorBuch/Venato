<?php

namespace App\Http\Controllers;

use App\Models\ConsumedMeal;
use App\Models\Meal;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ConsumedMealController extends Controller
{

    public function getMeals(Request $request)
    {
        try {
            $userWithMeals = auth()->user()->load('consumedMeals.meal');
            $consumedMeals = $userWithMeals->consumedMeals->filter(function ($consumedMeal) use ($request) {
                return $consumedMeal->meal_type == $request->meal_type;
            });
            if ($request->has('date')) {
                $date = Carbon::parse($request->date);
                $consumedMeals = $consumedMeals->filter(function ($consumedMeal, $key) use ($date) {
                    return $consumedMeal->created_at->format('Y-m-d') == $date->format('Y-m-d');
                });
            } else {
                $consumedMeals = $consumedMeals->filter(function ($consumedMeal) {
                    return $consumedMeal->created_at->isToday();
                });
            }
            // TODO: make it take into account if the user has set a custom portion size in the consumed meal
            $meals = $consumedMeals->pluck('meal');
            $meals = $meals->unique('id');
            return response()->json($meals);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function addMeal(Request $request)
    {
        $user = auth()->user();
        $meal = new ConsumedMeal();
        $meal->user_id = $user->id;
        $meal->meal_id = $request->meal_id;
        $meal->meal_type = $request->meal_type;
        $meal->portion = $request->portion;
        $meal->portion_unit = $request->portion_unit;
        $meal->save();
        return response()->json($meal);
    }

    public function deleteMeal(Request $request, $id)
    {
        $user = auth()->user();
        $meal = ConsumedMeal::where('user_id', $user->id)->where('meal_id', $id)->first();
        $meal->delete();
        return response()->json(['message' => 'Meal deleted successfully']);
    }
}
