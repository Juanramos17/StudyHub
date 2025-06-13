@component('mail::message')
# Hola {{ $teacherName }},

Tu curso **"{{ $courseTitle }}"** ha sido **{{ $status }}**.

@if($status === 'ocultado')
El curso ya no será visible para los estudiantes.
@else
El curso está visible nuevamente para los estudiantes.
@endif

Si tienes alguna duda, no dudes en contactarnos.

Gracias por usar StudyHub.

Saludos,<br>
{{ config('app.name') }}
@endcomponent
