<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'name',
        'description',
        'duration',
        'image',
        'pdf',
        'teacher_id',
        'isHidden',
        'created_at',
        'updated_at',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function tests()
{
    return $this->hasMany(Test::class);
}

   
    public function students()
    {
        return $this->hasMany(Student::class, 'course_id');
    }

}
