<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConsumedMealController;
use App\Http\Controllers\FoodProductsController;
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

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post(
        '/logout',
        [AuthController::class, 'logout']
    );
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::put('/user', [AuthController::class, 'updateUser']);
});

Route::group(['middleware' => 'auth:api',], function () {
    Route::get('/meals', [MealController::class, 'getMeals']);
    Route::post('/meals', [MealController::class, 'addMeal']);
    Route::delete('/meals/{id}', [MealController::class, 'deleteMeal']);

    Route::get('/consumed_meals/{meal_type}', [ConsumedMealController::class, 'getMeals']);
    Route::get('/consumed_meals', [ConsumedMealController::class, 'getAllMeals']);
    Route::post('/consumed_meals', [ConsumedMealController::class, 'addMeal']);
    Route::put('/consumed_meals/{id}', [ConsumedMealController::class, 'updateMeal']);
    Route::delete('/consumed_meals/{id}', [ConsumedMealController::class, 'deleteMeal']);
});

Route::get('/foodDB', [FoodProductsController::class, 'importFoodProducts']);
