<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bienvenido a Study Hub</title>
    <style>
        body {
            background-color: #ffffff;
            color: #333333;
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            border: 1px solid #eeeeee;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }
        h1 {
            color: #2c3e50;
        }
        .btn {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            margin-top: 20px;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #888888;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>¡Hola {{ $user->name }}!</h1>
        <p>¡Bienvenido a <strong>Study Hub</strong>! Estamos muy contentos de tenerte con nosotros.</p>

        <p>Study Hub es una plataforma diseñada para ayudarte a organizar tus estudios, mejorar tu productividad y alcanzar tus metas académicas.</p>

        <h3>¿Qué podés hacer con Study Hub?</h3>
        <ul>
            <li>📚 Acceder a materiales de estudio personalizados.</li>
            <li>🧠 Revisar tu progreso y estadísticas de aprendizaje.</li>
        </ul>

        <p>Para comenzar, te recomendamos visitar unas recomendaciones:</p>

        <a href="{{ url('/home') }}" class="btn">Ir al Panel</a>

        <p>Si tenés alguna duda o necesitás ayuda, podés contactarnos en cualquier momento.</p>

        <p>¡Te deseamos mucho éxito en esta nueva etapa!</p>

        <div class="footer">
            © {{ date('Y') }} Study Hub · Todos los derechos reservados<br>
            Este mensaje fue enviado automáticamente, por favor no respondas a este correo.
        </div>
    </div>
</body>
</html>
