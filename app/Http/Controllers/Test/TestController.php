<?php

namespace App\Http\Controllers\Test;

use App\Http\Controllers\Controller;
use App\Models\Stadistic;
use App\Models\Student;
use App\Models\Test;
use App\Models\TestEvaluation;
use Illuminate\Http\Request;



class TestController extends Controller
{ // Asegúrate de importar el modelo

    public function guardar(Request $request)
    {
        $request->validate([
            'usuario_id' => 'required|string|exists:users,id',
            'aciertos' => 'required|integer',
            'fallos' => 'required|integer',
            'no_respondidas' => 'required|integer',
            'nota' => 'required|numeric',
            'idCurso' => 'required|string|exists:courses,id',
            'idTest' => 'required|string|exists:tests,id',
        ]);

        $estudiante = Student::where('user_id', $request->usuario_id)
            ->where('course_id', $request->idCurso)
            ->first();

        if (!$estudiante) {
            return back()->withErrors(['usuario_id' => 'No se encontró el estudiante.']);
        }

        TestEvaluation::where('student_id', $estudiante->id)
            ->where('test_id', $request->idTest)
            ->delete();

        $testEvaluation = new TestEvaluation();
        $testEvaluation->student_id = $estudiante->id;
        $testEvaluation->correct_answers = $request->aciertos;
        $testEvaluation->incorrect_answers = $request->fallos;
        $testEvaluation->unanswered_questions = $request->no_respondidas;
        $testEvaluation->score = $request->nota;
        $testEvaluation->is_passed = $request->nota >= 5;
        $testEvaluation->test_id = $request->idTest;

        $testEvaluation->save();

        // Obtener o crear la estadística
        $estadistica = Stadistic::firstOrNew([
            'student_id' => $estudiante->id,
            'test_id' => $request->idTest,
        ]);

        // Sumar los valores si ya existía
        $estadistica->correct_answers = ($estadistica->correct_answers ?? 0) + $request->aciertos;
        $estadistica->incorrect_answers = ($estadistica->incorrect_answers ?? 0) + $request->fallos;
        $estadistica->unanswered_questions = ($estadistica->unanswered_questions ?? 0) + $request->no_respondidas;
        $estadistica->total_questions = $estadistica->correct_answers + $estadistica->incorrect_answers + $estadistica->unanswered_questions;
        $estadistica->score = $request->nota;
        $estadistica->status = $request->nota >= 5 ? 'aprobado' : 'suspendido';
        $estadistica->completed_at = now();
        $estadistica->save();
        $testsDelCurso = Test::where('course_id', $request->idCurso)->pluck('id')->toArray();

        $evaluaciones = TestEvaluation::where('student_id', $estudiante->id)
            ->whereIn('test_id', $testsDelCurso)
            ->get();

        $testsRealizadosIds = $evaluaciones->pluck('test_id')->unique()->toArray();

        $completoTodos = count($testsRealizadosIds) === count($testsDelCurso);

        $evaluacionesAprobadas = $evaluaciones->filter(function ($eval) {
            return $eval->score >= 5;
        })->count();

        $todosAprobados = $evaluacionesAprobadas === count($testsDelCurso);

        if ($completoTodos && $todosAprobados) {
            if (is_null($estudiante->completion_date)) {
                $estudiante->completion_date = now();
                $estudiante->save();
            }
        } else {
            if (!is_null($estudiante->completion_date)) {
                $estudiante->completion_date = null;
                $estudiante->save();
            }
        }

        return redirect()->route('course', ['id' => $request->idCurso])
            ->with('message', 'Test guardado correctamente.');
    }
}
