<?php

use App\Http\Controllers\ProvisionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\ProController;
use App\Http\Controllers\PhotoController;

use App\Http\Middleware\Authenticate;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// })->middleware('age');


// Route::get('/{age}', function($age)
// {
//     return view('welcome');
// })->middleware('age');

// Route::get('/post', [PostController::class, 'index']);
// Route::get('/user', [TestController::class]);
Route::middleware('auth')->group( function()
{
    Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

    Route::get('/profile', function ()
    {
        return view('example');
    })->name('profile');

    Route::get('/dashboard', function ()
    {
        return view('dashboard');
    });

    Route::controller(PhotoController::class)->group( function()
    {
        Route::get('/photos', 'index');
        Route::get('/photos/create', 'create');
    })->name('photos');
});

Route::withoutMiddleware('auth')->group( function ()
{
    Route::get('/', function ()
    {
        return view('welcome');
    });

    Route::get('/post/{id}', [PostController::class, 'index']);

    
});
// Route::get('/profile', ProController::class)->middleware('auth');

// Route::get('student/details', function(){
//     $url = route('student.details');
//     return $url;
// })->name('student.details');

// Route::get('/example', function (){
//     return view('example');
// });

// Route::get('/contact-us', function ()
// {
//     return "This is Contact Page";
// });

// Route::get('/about', function ()
// {
//     return "This is About Page";
// });

// Route::get('/post/{id?}', function ($id=null)
// {
//     return "Post ID is ".$id;
// });

// Route::get('/user/{id?}/{name?}', function ($id=null,$name=null)
// {
//     return "ID: ".$id." ".$name;
// })->where(['id'=>'[0-9]+', 'name'=>'[a-zA-Z]+']);

// Route::group(['prefix'=>'tutorial', 'middleware'=>'age'], function()
// {
//     Route::get('/aws', function()
//     {
//         echo "AWS Tutorials";
//     });
    
//     Route::get('/azure', function()
//     {
//         echo "Azure Tutorials";
//     });
// });

// Route::get('student/details/example', array(
//     'as' => 'student.details', function()
//     {
//         $url = route('student.details');
//         return "The url is: ".$url;
//     }
// ));

// Route::get('user/{id}/profile',function($id)  
// {  
//    $url=route('profile',['id'=>100]);  
//     return $url;  
// })->name('profile');  
Auth::routes();

// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
