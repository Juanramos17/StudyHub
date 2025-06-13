<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserBanStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $status;

    public function __construct($userName, $status)
    {
        $this->userName = $userName;
        $this->status = $status;
    }

    public function build()
    {
        return $this->subject("Estado de tu cuenta actualizado")
                    ->markdown('emails.user.ban_status_changed');
    }
}
