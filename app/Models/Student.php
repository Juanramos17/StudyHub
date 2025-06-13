<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'user_id',
        'course_id',
        'enrollment_date',
        'completion_date',
        'status',
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

   public function stadistics()
{
    return $this->hasMany(Stadistic::class);
}
}
