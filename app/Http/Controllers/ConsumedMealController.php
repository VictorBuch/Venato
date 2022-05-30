<?php

namespace App\Http\Controllers;

use App\Models\ConsumedMeal;
use App\Models\Meal;
use Illuminate\Http\Request;

class ConsumedMealController extends Controller
{

    public function getMeals(Request $request, $meal_type)
    {
        $user = auth()->user();
        $userMealTable = ConsumedMeal::where('user_id', $user->id)->where('meal_type', $meal_type)->get();
        $meals = Meal::where('id', $userMealTable->pluck('meal_id'))->get();
        dd($meals);
        return response()->json($meals);
    }

    public function addMeal(Request $request)
    {
        $user = auth()->user();
        $meal = new ConsumedMeal();
        $meal->user_id = $user->id;
        $meal->meal_id = $request->meal_id;
        $meal->meal_type = $request->meal_type;
        $meal->save();
        return response()->json($meal);
    }

    public function deleteMeal(Request $request, $id)
    {
        $user = auth()->user();
        $meal = ConsumedMeal::where('user_id', $user->id)->find($id);
        $meal->delete();
        return response()->json(['message' => 'Meal deleted successfully']);
    }
}
