<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\Course\TituloPdf;
use App\Http\Controllers\Courses\CoursesController;
use App\Http\Controllers\Favorite\FavoriteController;
use App\Http\Controllers\Home\HomeController as HomeController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Rating\RatingController;
use App\Http\Controllers\Test\TestController;
use App\Http\Controllers\Test\TestPdf;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('auth/login');
    })->name('login');

    Route::get('/register', function () {
        return Inertia::render('auth/register');
    })->name('register');

    Route::get('/', function () {
        return Inertia::render('welcome/Index');
    })->name('welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {
   
    Route::get('/courses', function () {
        return Inertia::render('courses/Index');
    })->name('courses.index');

    Route::get('/course', function () {
        return Inertia::render('course/Index');
    })->name('course.index');

    Route::get('/admin', function (Request $request) {
        abort_unless(auth()->check() && auth()->user()->rol === 'admin', 403);
        $controller = app(AdminController::class);
        return $controller->index($request);
    })->name('admin.index');

    Route::put('/admin/{id}/ban', function ($id) {
        abort_unless(auth()->check() && auth()->user()->rol === 'admin', 403);
        $controller = app(AdminController::class);
        return $controller->ban($id);
    });

    Route::put('/admin/{id}/hide', function ($id) {
        abort_unless(auth()->check() && auth()->user()->rol === 'admin', 403);
        $controller = app(AdminController::class);
        return $controller->hide($id);
    });

    Route::delete('/admin/{id}/user', function ($id) {
        abort_unless(auth()->check() && auth()->user()->rol === 'admin', 403);
        $controller = app(AdminController::class);
        return $controller->deleteUser($id);
    });

    Route::delete('/admin/{id}/course', function ($id) {
        abort_unless(auth()->check() && (auth()->user()->rol === 'admin' || auth()->user()->rol === 'teacher'), 403);
        $controller = app(AdminController::class);
        return $controller->deleteCourse($id);
    });

    Route::delete('/admin/{id}/test', function ($id) {
        abort_unless(auth()->check() && (auth()->user()->rol === 'admin' || auth()->user()->rol === 'teacher'), 403);
        $controller = app(AdminController::class);
        return $controller->deleteTest($id);
    });

    Route::get('/admin/{id}/editUser', function ($id) {
        abort_unless(auth()->check() && auth()->user()->rol === 'admin', 403);
        $controller = app(AdminController::class);
        return $controller->editUser($id);
    });

    Route::get('/admin/{id}/editCourse', function ($id) {
        abort_unless(auth()->check() && auth()->user()->rol === 'admin', 403);
        $controller = app(AdminController::class);
        return $controller->editCourse($id);
    });

    Route::match(['put', 'post'], '/admin/{id}/updateUser', function (Request $request, $id) {
        abort_unless(auth()->check() && auth()->user()->rol === 'admin', 403);
        $controller = app(AdminController::class);
        return $controller->updateUser($request, $id);
    })->name('admin.updateUser');

    Route::match(['put', 'post'], '/admin/{id}/updateCourse', function (Request $request, $id) {
        abort_unless(auth()->check() && auth()->user()->rol === 'admin', 403);
        $controller = app(AdminController::class);
        return $controller->updateCourse($request, $id);
    })->name('admin.updateCourse');

    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/profile/{id}/profile', [ProfileController::class, 'profileAdmin'])->name('profile.admin');
    Route::post('/profile/createCourse', [ProfileController::class, 'createCourse'])->name('profile.createCourse');
    Route::post('/profile/createTest', [ProfileController::class, 'createTest'])->name('profile.createTest');
    Route::get('/profile/{idCursoSeleccionado}/editCourse', [ProfileController::class, 'editCourse'])->name('profile.editCourse');
    Route::put('/profile/{courseid}/storeCourse', [ProfileController::class, 'updateCourse'])->name('profile.updateCourse');

    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/courses', [CoursesController::class, 'index'])->name('courses.list');
    Route::get('/course/{id}', [CourseController::class, 'index'])->name('course.view');
    Route::post('/course/{id}/enrollment', [CourseController::class, 'enrollment'])->name('course.enroll');
    Route::get('/test/{id}', [CourseController::class, 'courseTest'])->name('test.view');
    Route::post('/favorite', [FavoriteController::class, 'favorite'])->name('favorite.store');
    Route::get('/admin/createCourse', [AdminController::class, 'createCourse'])->name('admin.createCourse');
    Route::get('/admin/createUser', [AdminController::class, 'createUser'])->name('admin.createUser');
    Route::post('/admin/storeCourse', [AdminController::class, 'storeCourse'])->name('admin.storeCourse');
    Route::post('/admin/storeUser', [AdminController::class, 'storeUser'])->name('admin.storeUser');
    Route::post('/rating', [RatingController::class, 'rating'])->name('rating.store');
    Route::get('/test/{student_id}/{test_id}', [TestPdf::class, 'generarPdf'])->name('test.pdf');
    Route::get('/ver-pdf', [TestPdf::class, 'verPDF'])->name('test.verPDF');
    Route::get('/course/titulo/{course_id}', [TituloPdf::class, 'generarPdfTitulo'])->name('course.pdfTitulo');
    Route::get('/ver-pdf', [TituloPdf::class, 'verPDF'])->name('course.verPDF');
});

Route::match(['put', 'post'], '/test', function (Request $request) {
    $controller = app(TestController::class);
    return $controller->guardar($request);
})->name('test.guardar');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
