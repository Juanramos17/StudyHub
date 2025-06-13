<?php

namespace App\Http\Controllers\Header;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class HeaderController extends Controller
{
	public function index(){

        $cursos = Course::all();

        
        return inertia('home/Index', [
            'user' => Auth::user(),
            'courses' => $cursos,
        ]);

    }
}