<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'test_id',
        'question_text',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_option',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the test that owns the question.
     */
    public function test()
    {
        return $this->belongsTo(Test::class, 'test_id');
    }
}
