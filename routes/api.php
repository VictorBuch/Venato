<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConsumedMealController;
use App\Http\Controllers\MealController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => '/auth'], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('/meals', [MealController::class, 'getMeals'])->middleware('auth:sanctum');
    Route::post('/meals', [MealController::class, 'addMeal'])->middleware('auth:sanctum');
    Route::delete('/meals/{id}', [MealController::class, 'deleteMeal'])->middleware('auth:sanctum');

    Route::get('/consumed_meals/{meal_type}', [ConsumedMealController::class, 'getMeals'])->middleware('auth:sanctum');
    Route::post('/consumed_meals', [ConsumedMealController::class, 'addMeal'])->middleware('auth:sanctum');
    Route::delete('/consumed_meals/{id}', [ConsumedMealController::class, 'deleteMeal'])->middleware('auth:sanctum');
});
