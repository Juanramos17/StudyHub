<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stadistic extends Model
{

    use HasUuids, HasFactory;
    protected $fillable = [
        'student_id',
        'test_id',
        'total_questions',
        'correct_answers',
        'incorrect_answers',
        'unanswered_questions',
        'completed_at',
        'score',
        'status',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the test that owns the statistic.
     */
    public function test()
{
    return $this->belongsTo(Test::class);
}


    /**
     * Get the student that owns the statistic.
     */
    public function student()
{
    return $this->belongsTo(Student::class);
}
   
}
