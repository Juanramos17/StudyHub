<?php

namespace App\Http\Controllers\Favorite;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function favorite(Request $request)
    {

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        // Obtén el curso por el ID recibido
        $course = Course::find($request->course_id);

        $favorite = Favorite::where('user_id', $request->user_id)
            ->where('course_id', $request->course_id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            $status = 'quitado';
        } else {
            Favorite::create([
                'user_id' => $request->user_id,
                'course_id' => $request->course_id,
            ]);
            $status = 'añadido';
        }

        return redirect()->back()->with('message', "El curso {$course->name} ha sido {$status} correctamente.");
    }
}
