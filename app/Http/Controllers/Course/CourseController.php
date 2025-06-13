<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Favorite;
use App\Models\Question;
use App\Models\Rating;
use App\Models\Student;
use App\Models\Test;
use App\Models\TestEvaluation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


use function Laravel\Prompts\alert;

class CourseController extends Controller
{
    public function index($id)
    {

        $curso = Course::findOrFail($id);
        $profesor = User::findOrFail($curso->teacher_id);
        $tests = Test::where("course_id", $curso->id)->get();
        $user = Auth::user();
        $isFavorite = Favorite::where('user_id', $user->id)
            ->where('course_id', $curso->id)
            ->exists();
        $matriculado = Student::where('user_id', $user->id)
            ->where('course_id', $curso->id)
            ->exists();
        $rating = Rating::where('user_id', $user->id)
            ->where('course_id', $curso->id)->pluck('rating');
        $ratingCourse = Rating::where('course_id', $curso->id);

        $count = $ratingCourse->count();
        $average = $count > 0 ? round($ratingCourse->avg('rating'), 1) : 0.0;

        $student = Student::where('user_id', $user->id)
            ->where('course_id', $curso->id)
            ->first();

        $resultado = [
            'media' => $average,
            'total' => $count,
        ];

        if ($matriculado) {
            $tests->map(function ($test) use ($student) {
                $hecho = TestEvaluation::where('student_id', $student->id)
                    ->where('test_id', $test->id)->exists();
                if ($hecho) {
                    $test->hecho = true;
                } else {
                    $test->hecho = false;
                }
                return $test;
            });
        }


        return Inertia::render("course/Index", [
            'course' => $curso,
            'profesor' => $profesor,
            'tests' => $tests,
            'user' => $user,
            'isFavorite' => $isFavorite,
            'matriculado' => $matriculado,
            'rating' => $rating,
            'courseRating' => $resultado,
            'student' => $student,
        ]);
    }

    public function courseTest($id)
    {
        //EL ID ES EL ID DEL TEST



        $test = Test::where("id", $id)->firstOrFail();
        $questions = Question::where("test_id", $id)->get();
        // $questions = Question::all();


        return Inertia::render("test/Index", [
            'user' => Auth::user(),
            'test' => $test,
            'questions' => $questions,
        ]);
    }

    public function enrollment($id)
    {
        $user = Auth::user();

        $matricula = Student::where('user_id', $user->id)
            ->where('course_id', $id)
            ->first();

        if ($matricula) {
            $matricula->delete();

            $url = "/course/{$id}";
            return redirect($url)
                ->with('message', 'Te has desmatriculado del curso correctamente.');
        }

        Student::create([
            'user_id' => $user->id,
            'course_id' => $id,
            'enrollment_date' => Carbon::today(),
            'completion_date' => null,
            'status' => true,
        ]);

        $url = "/course/{$id}";
        return redirect($url)
            ->with('message', 'Te has matriculado correctamente al curso.');
    }
}
