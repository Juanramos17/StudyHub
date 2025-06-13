<?php

namespace App\Http\Controllers\Rating;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Favorite;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    public function rating(Request $request)
    {

        $request->validate([
            'courseId' => 'required|exists:courses,id',
            'rating' => 'required|numeric|min:1|max:5'
        ]);

    $userId = Auth::user()->id;

    $rating = Rating::where('user_id', $userId)
        ->where('course_id', $request->courseId)
        ->first();

    if ($rating) {
        $rating->rating = $request->rating;
        $rating->save();

        return redirect()->back()->with('message', "Valoración actualizada correctamente");
    } else {
        
        Rating::create([
            'user_id' => $userId,
            'course_id' => $request->courseId,
            'rating' => $request->rating
        ]);

        return redirect()->back()->with('message', "Valoración creada correctamente");
    }
}
}
