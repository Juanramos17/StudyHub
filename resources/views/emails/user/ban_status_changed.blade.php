@component('mail::message')
# Hola {{ $userName }},

Tu cuenta ha sido **{{ $status }}**.

@if($status == 'baneado')
Por favor, contacta al soporte si crees que esto es un error.
@else
¡Bienvenido de nuevo! Ya puedes acceder a la plataforma normalmente.
@endif

Gracias por usar StudyHub.

Saludos,<br>
{{ config('app.name') }}
@endcomponent
