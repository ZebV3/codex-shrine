<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\View\View;

class TestController extends Controller
{
    public function __invoke()
    {
        return "Invoked";
    }
}
