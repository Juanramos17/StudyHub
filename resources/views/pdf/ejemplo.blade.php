<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resultados del Examen</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 40px;
            color: #222;
        }
        h1 {
            color: #004085;
            border-bottom: 2px solid #004085;
            padding-bottom: 8px;
        }
        p {
            font-size: 14px;
            margin: 5px 0;
        }
        .datos-usuario {
            background-color: #e9f2ff;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 30px;
            width: fit-content;
        }
        .resultado {
            font-size: 18px;
            margin: 10px 0;
        }
        .correctas {
            color: green;
        }
        .falladas {
            color: #c9302c;
        }
        .no-respondidas {
            color: #6c757d;
        }
        .nota-final {
            font-size: 22px;
            font-weight: bold;
            color: #155724;
            margin-top: 40px;
            padding: 15px;
            border: 2px solid #155724;
            border-radius: 8px;
            width: fit-content;
        }
        .firma {
            margin-top: 60px;
            font-style: italic;
            color: #555;
        }
        hr.firma-line {
            width: 250px;
            border: 1px solid #aaa;
            margin-top: 15px;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <h1>Resultados del Examen</h1>

    <div class="datos-usuario">
        <p><strong>Nombre:</strong> {{ $usuario->name ?? 'Usuario desconocido' }}</p>
        <p><strong>Email:</strong> {{ $usuario->email ?? 'Sin email' }}</p>
        <p><strong>Test:</strong> {{ $test->name ?? 'Test desconocido' }}</p>
    </div>

    <div class="resultado correctas">
        <strong>Preguntas acertadas:</strong> {{ $testEvaluation->correct_answers ?? 0 }}
    </div>
    <div class="resultado falladas">
        <strong>Preguntas falladas:</strong> {{ $testEvaluation->incorrect_answers ?? 0 }}
    </div>
    <div class="resultado no-respondidas">
        <strong>Preguntas no respondidas:</strong> {{ $testEvaluation->unanswered_questions ?? 0 }}
    </div>

    <div class="nota-final">
        Nota final: {{ $testEvaluation->score ?? 'N/A' }}
    </div>

    <div class="firma">
        <p>Firma y Sello:</p>
        <hr class="firma-line">
        <p>_______________________</p>
    </div>
</body>
</html>
