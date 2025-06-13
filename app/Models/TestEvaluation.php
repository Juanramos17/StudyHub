<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestEvaluation extends Model
{
    /** @use HasFactory<\Database\Factories\TestEvaluationFactory> */
    use HasUuids, HasFactory;

    protected $fillable = [
        'test_id',
        'student_id',
        'correct_answers',
        'incorrect_answers',
        'unanswered_questions',
        'score',
        'is_passed',
        'created_at',
        'updated_at',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
    public function test()
    {
        return $this->belongsTo(Test::class, 'test_id');
    }
    
}
