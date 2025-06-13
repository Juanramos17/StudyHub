<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\BienvenidaUsuario;
use App\Mail\CourseVisibilityChanged;
use App\Mail\UserBanStatusChanged;
use App\Models\Course;
use App\Models\Favorite;
use App\Models\Rating;
use App\Models\Test;
use App\Models\TestEvaluation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $studentSearch = $request->input('studentSearch');
        $teacherSearch = $request->input('teacherSearch');
        $courseSearch = $request->input('courseSearch');

        $students = User::where('rol', 'student')
            ->when($studentSearch, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            })
            ->get();

        $teachers = User::where('rol', 'teacher')
            ->when($teacherSearch, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            })
            ->get();

        $courses = Course::query()
            ->when($courseSearch, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            })
            ->get();

        $favoritos = Favorite::select('course_id')
            ->with('course:id,name')
            ->selectRaw('count(*) as total_favorites')
            ->groupBy('course_id')
            ->orderByDesc('total_favorites')
            ->limit(10)
            ->get();

        // 2. Cursos mejor valorados (media rating) con info del curso
        $mejoresValorados = Rating::select('course_id')
            ->with('course:id,name')
            ->selectRaw('avg(rating) as avg_rating, count(*) as total_ratings')
            ->groupBy('course_id')
            ->orderByDesc('avg_rating')
            ->limit(10)
            ->get();

        // 3. Estudiantes con mejores estadísticas (promedio scores y tests tomados) con usuario
        $mejoresEstudiantes = TestEvaluation::with('student.user:id,name')
            ->select('student_id')
            ->selectRaw('avg(score) as avg_score, count(id) as tests_taken')
            ->groupBy('student_id')
            ->orderByDesc('avg_score')
            ->limit(10)
            ->get();

        // 4. Tests más realizados con info del test
        $testsMasRealizados = TestEvaluation::select('test_id')
            ->with('test:id,name')
            ->selectRaw('count(*) as total_evaluations')
            ->groupBy('test_id')
            ->orderByDesc('total_evaluations')
            ->limit(10)
            ->get();

        // 5. Tests más difíciles y fáciles (promedio score y tasa de aprobación)
        $testsDificilesFaciles = TestEvaluation::select('test_id')
            ->with('test:id,name')
            ->selectRaw('
        avg(score) as avg_score,
        sum(case when is_passed = 1 then 1 else 0 end) as total_passed,
        sum(case when is_passed = 0 then 1 else 0 end) as total_failed
    ')
            ->groupBy('test_id')
            ->orderBy('avg_score')
            ->limit(10)
            ->get();
        return Inertia::render('admin/Index', [
            'user' => Auth::user(),
            'students' => $students,
            'teachers' => $teachers,
            'courses' => $courses,
            'favoritos' => $favoritos,
            'mejoresValorados' => $mejoresValorados,
            'mejoresEstudiantes' => $mejoresEstudiantes,
            'testsMasRealizados' => $testsMasRealizados,
            'testsDificilesFaciles' => $testsDificilesFaciles,
            'filters' => [
                'studentSearch' => $studentSearch,
                'teacherSearch' => $teacherSearch,
                'courseSearch' => $courseSearch,
                'tab' => $request->input('tab', 'students'),
            ],
        ]);
    }


    public function ban($id)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $user = User::findOrFail($id);

        $user->isBanned = !$user->isBanned;
        $user->save();

        $userName = $user->name;
        $status = $user->isBanned ? 'baneado' : 'desbaneado';

        Mail::to($user->email)->send(new UserBanStatusChanged($userName, $status));


        return redirect()->back()->with('message', "El usuario {$userName} ha sido {$status} correctamente.");
    }


    public function hide($id)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $course = Course::findOrFail($id);

        $course->isHidden = !$course->isHidden;
        $course->save();

        $status = $course->isHidden ? 'ocultado' : 'visible nuevamente';

        $teacher = $course->teacher;
        if ($teacher) {
            Mail::to($teacher->email)->send(new CourseVisibilityChanged($course->name, $status, $teacher->name));
        }

        return redirect()->back()->with('message', "El curso '{$course->title}' ahora está {$status}.");
    }

    public function deleteUser($id)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $user = User::findOrFail($id);
        $userName = $user->name;

        if ($user->image && file_exists(public_path($user->image))) {
            unlink(public_path($user->image));
        }

        $user->delete();

        return redirect()->back()->with('message', "El usuario {$userName} ha sido eliminado correctamente.");
    }

    public function deleteCourse($id)
    {

        $course = Course::findOrFail($id);
        $courseTitle = $course->name;

        if ($course->image && file_exists(public_path($course->image))) {
            unlink(public_path($course->image));
        }

        if ($course->pdf && file_exists(public_path($course->pdf))) {
            unlink(public_path($course->pdf));
        }

        $course->delete();

        $previousUrl = url()->previous();

        if (str_contains($previousUrl, '/admin')) {
            return redirect('/admin')->with('message', "El curso '{$courseTitle}' ha sido eliminado correctamente.");
        } else {
            return redirect('/courses')->with('message', "El curso '{$courseTitle}' ha sido eliminado correctamente.");
        }
    }

    public function deleteTest($id)
    {

        $test = Test::findOrFail($id);
        $testName = $test->name;
        $test->delete();

        return redirect()->back()->with('message', "El test '{$testName}' ha sido eliminado correctamente.");
    }

    public function createUser(Request $request)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        return Inertia::render('admin/CreateUser', [
            'rol' => $request->rol,
        ]);
    }

    public function createCourse()
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $teachers = User::where('rol', 'teacher')->get(['id', 'name']);
        return Inertia::render('admin/CreateCourse', [
            'teachers' => $teachers,
        ]);
    }


    public function storeUser(Request $request)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'rol' => 'required|in:teacher,student',
            'description' => 'nullable|string',
            'isBanned' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->rol = $request->rol;
        $user->description = $request->description;
        $user->isBanned = $request->isBanned;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();

            $pathFolder = $user->rol === 'teacher' ? 'img/Teachers' : 'img/Students';
            $file->move(public_path($pathFolder), $filename);

            $user->image = $pathFolder . '/' . $filename;
        }

        $user->save();

        return redirect('/admin')->with('message', "El usuario {$user->name} ha sido creado correctamente.");
    }

    public function storeCourse(Request $request)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:courses,name',
            'description' => 'required|string',
            'teacher_id' => 'required|exists:users,id',
            'isHidden' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'pdf' => 'nullable|mimes:pdf|max:5120',
        ]);

        $course = new Course();
        $course->name = $request->name;
        $course->description = $request->description;
        $course->duration = 0;
        $course->teacher_id = $request->teacher_id;
        $course->isHidden = $request->isHidden;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
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

        $course->save();

        return redirect('/admin')->with('message', "El curso '{$course->name}' ha sido creado correctamente.");
    }

    public function editUser($id)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }
        $user = User::findOrFail($id);

        return Inertia::render('admin/EditUser', [
            'user' => $user,
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'rol' => 'required|in:teacher,student',
            'description' => 'nullable|string',
            'isBanned' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->rol = $request->rol;
        $user->description = $request->description;
        $user->isBanned = $request->isBanned;

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

        return redirect('/admin')->with('message', "El usuario {$user->name} ha sido actualizado correctamente.");
    }

    public function editCourse($id)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $course = Course::findOrFail($id);
        $teachers = User::where('rol', 'teacher')->get(['id', 'name']);

        return Inertia::render('admin/EditCourse', [
            'course' => $course,
            'teachers' => $teachers,
        ]);
    }

    public function updateCourse(Request $request, $id)
    {
        if (Auth::user()->rol !== 'admin') {
            abort(403, 'Acceso denegado.');
        }

        $course = Course::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:courses,name,' . $course->id,
            'description' => 'required|string',
            'teacher_id' => 'required|exists:users,id',
            'isHidden' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
            'pdf' => 'nullable|mimes:pdf|max:5120',
        ]);

        $course->name = $request->name;
        $course->description = $request->description;
        $course->teacher_id = $request->teacher_id;
        $course->isHidden = $request->isHidden;

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

        return redirect('/admin')->with('message', "El curso '{$course->name}' ha sido actualizado correctamente.");
    }
}
