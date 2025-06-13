<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CourseVisibilityChanged extends Mailable
{
    use Queueable, SerializesModels;

    public $courseTitle;
    public $status;
    public $teacherName;

    public function __construct($courseTitle, $status, $teacherName)
    {
        $this->courseTitle = $courseTitle;
        $this->status = $status;
        $this->teacherName = $teacherName;
    }

    public function build()
    {
        return $this->subject("Estado del curso actualizado")
                    ->markdown('emails.course.visibility_changed');
    }
}
