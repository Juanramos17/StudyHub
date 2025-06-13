<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
	public function index(){

        $cursos = Course::all()->shuffle();

        
        return inertia('home/Index', [
            'user' => Auth::user(),
            'courses' => $cursos,
        ]);

    }
}