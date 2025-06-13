<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'name',
        'course_id',
        'duration',
        'number_of_questions',
        'status',
        'created_at',
        'updated_at',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function stadistics()
{
    return $this->hasMany(Stadistic::class);
}

}
