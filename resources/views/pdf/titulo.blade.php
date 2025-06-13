<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificado de Aprobación</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 40px;
            color: #222;
        }
        h1 {
            color: #155724;
            border-bottom: 2px solid #155724;
            padding-bottom: 8px;
        }
        p {
            font-size: 14px;
            margin: 5px 0;
        }
        .datos-usuario {
            background-color: #e2f7e1;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 30px;
            width: fit-content;
        }
        .mensaje-aprobado {
            font-size: 20px;
            font-weight: bold;
            color: #155724;
            margin-top: 30px;
            padding: 15px;
            border: 2px solid #155724;
            border-radius: 8px;
            background-color: #d4edda;
            width: fit-content;
        }
        .nota-final {
            font-size: 22px;
            font-weight: bold;
            color: #155724;
            margin-top: 20px;
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
    <h1>🎓 Certificado de Aprobación</h1>

    <div class="datos-usuario">
        <p><strong>Nombre:</strong> {{ $usuario->name ?? 'Usuario desconocido' }}</p>
        <p><strong>Email:</strong> {{ $usuario->email ?? 'Sin email' }}</p>
        <p><strong>Curso:</strong> {{ $curso->name ?? 'Curso desconocido' }}</p>
    </div>

    <div class="mensaje-aprobado">
        ¡Felicidades, has aprobado satisfactoriamente el curso!
    </div>

    <div class="nota-final">
        APROBADO
    </div>

    <div class="firma">
        <p>Firma y Sello:</p>
        <hr class="firma-line">
        <p>_______________________</p>
    </div>
    <br>
    <p>Fecha de emisión: {{ now()->format('d/m/Y') }}</p>
</body>
</html>
