<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\sy\SyuserController;
use App\Http\Controllers\MpController;
use App\Http\Controllers\UtController;
use App\Http\Controllers\TrController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// unprotected route
Route::controller(SyuserController::class)->group(function(){
    Route::post('/login', 'login');
    Route::post('/register', 'register');
});

//Protected Routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    //API Route for MP
    Route::controller(MpController::class)->group(function(){
        Route::get('/mp{slug}', 'get');
        Route::put('/mp{slug}', 'put');
        Route::delete('/mp{slug}', 'delete');
        
    });

    //API Route for TR
    Route::controller(TrController::class)->group(function(){
        Route::get('/tr{slug}', 'get');
        Route::put('/tr{slug}', 'put');
        Route::delete('/tr{slug}', 'delete');
        
    });

    //API Route for utilities
    Route::controller(UtController::class)->group(function(){
        Route::get('/ut{slug}', 'get');
    });
});
