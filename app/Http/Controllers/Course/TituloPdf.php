<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TituloPdf extends Controller
{
    public function generarPdfTitulo($course_id)
    {
        $usuario = Auth::user();

        $course = Course::findOrFail($course_id);

        $pdf = Pdf::loadView('pdf.titulo', [
            'usuario' => $usuario,
            'curso' => $course,
        ]);

        $nombreArchivo = $course->name . '-' . $usuario->id . '.pdf';
        $ruta = 'pdfs/' . $nombreArchivo;


        Storage::disk('public')->put($ruta, $pdf->output());

        $url = Storage::url($ruta);

        

        return view('ver_pdf', ['url' => $url]);
    }
}
