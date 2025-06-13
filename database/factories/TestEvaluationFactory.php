<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Test;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TestEvaluation>
 */
class TestEvaluationFactory extends Factory
{
    public function definition(): array
    {
        $student = Student::inRandomOrder()->first();

        if (!$student) {
            return [];
        }

        $test = $student->course_id
            ? Test::where('course_id', $student->course_id)->inRandomOrder()->first()
            : null;

        if (!$test && $student->course_id) {
            $test = Test::factory()->create(['course_id' => $student->course_id]);
        }

        if (!$test) {
            return [];
        }

        $totalQuestions = $test->number_of_questions ?? $this->faker->numberBetween(10, 50);

        $correctAnswers = $this->faker->numberBetween(0, $totalQuestions);

        $remaining = $totalQuestions - $correctAnswers;

        $incorrectAnswers = $this->faker->numberBetween(0, $remaining);

        $unansweredQuestions = $totalQuestions - $correctAnswers - $incorrectAnswers;

        $rawScore = $correctAnswers - ($incorrectAnswers * (1/3));
        $normalizedScore = max(0, min(10, round(($rawScore / $totalQuestions) * 10, 2)));

        $isPassed = $normalizedScore >= 6;

        return [
            'student_id' => $student->id,
            'test_id' => $test->id,
            'correct_answers' => $correctAnswers,
            'incorrect_answers' => $incorrectAnswers,
            'unanswered_questions' => $unansweredQuestions,
            'score' => $normalizedScore,
            'is_passed' => $isPassed,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
