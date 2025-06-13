<?php

namespace App\Http\Controllers\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Favorite;
use App\Models\Rating;
use Illuminate\Support\Facades\Auth;

class CoursesController extends Controller
{
    public function index()
{
    $usuario = Auth::user();
    $cursos = Course::where('isHidden', false)->get();
    $favoritos = Favorite::where('user_id', $usuario->id)->pluck('course_id')->toArray();

    $cursos->transform(function ($curso) use ($favoritos, $usuario) {
        $curso->is_favorite = in_array($curso->id, $favoritos);

        $ratingsCurso = Rating::where('course_id', $curso->id);
        $count = $ratingsCurso->count();
        $average = $count > 0 ? round($ratingsCurso->avg('rating'), 1) : 0.0;
        $curso->average_rating = $average;

        return $curso;
    });

    return inertia('courses/Index', [
        'user' => $usuario,
        'courses' => $cursos,
    ]);
}
}
