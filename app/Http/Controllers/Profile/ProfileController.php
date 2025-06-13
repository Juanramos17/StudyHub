<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Question;
use App\Models\Stadistic;
use App\Models\Student;
use App\Models\Test;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;
        $role = $user->rol;

        if ($role === 'student') {
            $enrollments = Student::with('course.tests')
                ->where('user_id', $userId)
                ->get();

            $studentIds = $enrollments->pluck('id')->toArray();

            $stadistics = Stadistic::whereIn('student_id', $studentIds)->get();

            return inertia('profile/Index', [
                'user' => $user,
                'enrollments' => $enrollments,
                'stadistics' => $stadistics,
                'role' => $role
            ]);
        } elseif ($role === 'teacher') {
            $courses = Course::where('teacher_id', $userId)
                ->with(['tests', 'students.stadistics.student.user'])
                ->get();

            $courseStats = $courses->map(function ($course) {
                $stats = $course->students->flatMap->stadistics;
                $stats = $stats->map(function ($stat) {
                    $name = $stat->student->user->name ?? $stat->student->name ?? null;
                    return array_merge($stat->toArray(), [
                        'student_name' => $name
                    ]);
                });
                return [
                    'course' => $course,
                    'stats' => $stats
                ];
            });

            return inertia('profile/Index', [
                'user' => $user,
                'courses' => $courses,
                'courseStats' => $courseStats,
                'role' => $role
            ]);
        }

        return abort(403, 'Rol no reconocido');
    }
    public function profileAdmin($id)
    {
        $user = User::where('id', $id)->first();

        $userId = $user ? $user->id : null;

        $enrollments = Student::with('course.tests')
            ->where('user_id', $userId)
            ->get();

        $studentIds = $enrollments->pluck('id')->toArray();

        $stadistics = Stadistic::whereIn('student_id', $studentIds)->get();

        return inertia('profile/Index', [
            'user' => $user,
            'enrollments' => $enrollments,
            'stadistics' => $stadistics,
        ]);
    }

    public function edit()
    {
        $user = Auth::user();

        return Inertia::render('profile/EditUser', [
            'user' => $user,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->description = $request->description;

        if ($request->hasFile('image')) {
            if ($user->image && file_exists(public_path($user->image))) {
                unlink(public_path($user->image));
            }

            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();

            if ($user->rol === 'teacher') {
                $pathFolder = 'img/Teachers';
            } else {
                $pathFolder = 'img/Students';
            }

            $file->move(public_path($pathFolder), $filename);

            $user->image = $pathFolder . '/' . $filename;
        }

        $user->save();

        return redirect('/profile')->with('message', "Tu perfil ha sido actualizado correctamente.");
    }

    public function createCourse(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:courses,name',
            'descripcion' => 'required|string',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'pdf' => 'nullable|mimes:pdf|max:5120',
        ]);

        $course = new Course();
        $course->name = $request->nombre;
        $course->description = $request->descripcion;

        if ($request->hasFile('imagen')) {
            $image = $request->file('imagen');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $pathFolder = 'img/Courses';
            $image->move(public_path($pathFolder), $filename);
            $course->image = $pathFolder . '/' . $filename;
        }

        if ($request->hasFile('pdf')) {
            $pdf = $request->file('pdf');
            $filename = time() . '_' . Str::random(10) . '.' . $pdf->getClientOriginalExtension();
            $pathFolder = 'pdf/Courses';
            $pdf->move(public_path($pathFolder), $filename);
            $course->pdf = $pathFolder . '/' . $filename;
        }

        $course->teacher_id = Auth::id();
        $course->isHidden = false; // Por defecto, el curso se crea visible se pondra en 0
        $course->duration = 0; // Duración inicial en 0, se actualiza más tarde al añadir tests

        $course->save();

        return redirect('/profile')->with('message', "El curso ha sido creado correctamente.");
    }
    public function createTest(Request $request)
    {

        //sumar duracion al curso
        $course = Course::findOrFail($request->id_curso);
        $course->duration += $request->duracion;
        $course->save();

        $test = new Test();
        $test->name = $request->nombre;
        $test->course_id = $request->id_curso;
        $test->duration = $request->duracion;
        $test->number_of_questions = $request->numeroPreguntas;
        $test->status = "null";

        $test->save();

        // PREGUNTAS DEL TEST

        $preguntas = json_decode($request->preguntas, true);

        foreach ($preguntas as $pregunta) {

            $questions = new Question();

            $questions->question_text = $pregunta['enunciado'];
            $questions->test_id = $test->id;

            $correcta = strtolower($pregunta['correcta']); // 'a', 'b', 'c' o 'd'

            switch ($correcta) {
                case 'a':
                    $questions->option_a = $pregunta['opcionB'];
                    $questions->option_b = $pregunta['opcionC'];
                    $questions->option_c = $pregunta['opcionD'];
                    $questions->correct_option = $pregunta['opcionA'];
                    break;
                case 'b':
                    $questions->option_a = $pregunta['opcionA'];
                    $questions->option_b = $pregunta['opcionC'];
                    $questions->option_c = $pregunta['opcionD'];
                    $questions->correct_option = $pregunta['opcionB'];
                    break;
                case 'c':
                    $questions->option_a = $pregunta['opcionA'];
                    $questions->option_b = $pregunta['opcionB'];
                    $questions->option_c = $pregunta['opcionD'];
                    $questions->correct_option = $pregunta['opcionC'];
                    break;
                case 'd':
                    $questions->option_a = $pregunta['opcionA'];
                    $questions->option_b = $pregunta['opcionB'];
                    $questions->option_c = $pregunta['opcionC'];
                    $questions->correct_option = $pregunta['opcionD'];
                    break;
                default:
                    $questions->option_a = $pregunta['opcionA'];
                    $questions->option_b = $pregunta['opcionB'];
                    $questions->option_c = $pregunta['opcionC'];
                    $questions->correct_option = null;
            }

            $questions->save();
        }

        return redirect('/profile')->with('message', "El test ha sido creado correctamente.");
    }
    public function editCourse($id)
    {

        $course = Course::findOrFail($id);
        $teacher = Auth::user();


        return Inertia::render('profile/EditCourse', [
            'course' => $course,
            'teacher' => $teacher->id,
        ]);
    }

    public function updateCourse(Request $request, $id)
    {

        $course = Course::findOrFail($id);
        
        
        $request->validate([
            'name' => 'required|string|max:255|unique:courses,name,' . $course->id,
            'description' => 'required|string',
            'teacher_id' => 'required|exists:users,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'pdf' => 'nullable|mimes:pdf|max:5120',
        ]);
        
        $course->name = $request->name;
        $course->description = $request->description;
        $course->teacher_id = $request->teacher_id;
        
        if ($request->hasFile('image')) {
            if ($course->image && file_exists(public_path($course->image))) {
                unlink(public_path($course->image));
            }
            
            $image = $request->file('image');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $pathFolder = 'img/Courses';
            $image->move(public_path($pathFolder), $filename);
            $course->image = $pathFolder . '/' . $filename;
        }
        
        if ($request->hasFile('pdf')) {
            if ($course->pdf && file_exists(public_path($course->pdf))) {
                unlink(public_path($course->pdf));
            }
            
            $pdf = $request->file('pdf');
            $filename = time() . '_' . Str::random(10) . '.' . $pdf->getClientOriginalExtension();
            $pathFolder = 'pdf/Courses';
            $pdf->move(public_path($pathFolder), $filename);
            $course->pdf = $pathFolder . '/' . $filename;
        }
        
        $course->save();

        return redirect('/profile')->with('message', "El curso '{$course->name}' ha sido actualizado correctamente.");
    }
}
