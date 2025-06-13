<?php

namespace App\Http\Controllers\Test;

use App\Http\Controllers\Controller;
use App\Models\Test;
use App\Models\TestEvaluation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TestPdf extends Controller
{
    public function generarPdf($student_id, $test_id)
    {
        // Ejemplo: obtener datos de la base de datos
        $usuario = Auth::user();

        $test = Test::find($test_id);

        $testEvaluation = TestEvaluation::where('student_id', $student_id)
            ->where('test_id', $test_id)
            ->first();


        // Pasa los datos a la vista
        $pdf = Pdf::loadView('pdf.ejemplo', [
            'usuario' => $usuario,
            'testEvaluation' => $testEvaluation,
            'test' => $test,
        ]);

        $nombreCurso = $test->name;

        $nombreArchivo = "$nombreCurso-$student_id.pdf";
        $ruta = 'pdfs/' . $nombreArchivo;
        Storage::disk('public')->put($ruta, $pdf->output());

        $url = Storage::url($ruta); // Esto genera la URL pública

        return view('ver_pdf', ['url' => $url]);
        // return redirect(Storage::url($ruta));

    }
}
