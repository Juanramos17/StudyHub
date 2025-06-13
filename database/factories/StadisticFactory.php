<?php

namespace Database\Factories;

use App\Models\Stadistic;
use App\Models\Student;
use App\Models\Test;
use Illuminate\Database\Eloquent\Factories\Factory;

class StadisticFactory extends Factory
{
    protected $model = Stadistic::class;

    public function definition(): array
    {
        $student = Student::inRandomOrder()->first();

        $test = $student && $student->course_id
            ? Test::where('course_id', $student->course_id)->inRandomOrder()->first()
            : null;

        if (!$test && $student && $student->course_id) {
            $test = Test::factory()->create(['course_id' => $student->course_id]);
        }

        if (!$student || !$test) {
            return [];
        }

        $totalQuestions = $this->faker->numberBetween(10, 50);
        $correctAnswers = $this->faker->numberBetween(0, $totalQuestions);
        $remaining = $totalQuestions - $correctAnswers;
        $incorrectAnswers = $this->faker->numberBetween(0, $remaining);
        $unansweredQuestions = $remaining - $incorrectAnswers;

        $rawScore = $correctAnswers - ($incorrectAnswers * (1 / 3));
        $normalizedScore = max(0, min(10, round(($rawScore / $totalQuestions) * 10, 2)));

        $completed = $this->faker->boolean(70);
        $completedAt = $completed ? $this->faker->dateTimeBetween('-1 month', 'now') : null;
        $status = $completed ? 'completed' : 'in_progress';

        return [
            'student_id' => $student->id,
            'test_id' => $test->id,
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctAnswers,
            'incorrect_answers' => $incorrectAnswers,
            'unanswered_questions' => $unansweredQuestions,
            'completed_at' => $completedAt,
            'score' => $normalizedScore,
            'status' => $status,
        ];
    }
}
