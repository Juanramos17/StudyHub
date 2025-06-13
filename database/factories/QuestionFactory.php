<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Test;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        $optionA = $this->faker->sentence(3);
        $optionB = $this->faker->sentence(3);
        $optionC = $this->faker->sentence(3);

        do {
            $correctOption = $this->faker->sentence(3);
        } while (
            $correctOption === $optionA ||
            $correctOption === $optionB ||
            $correctOption === $optionC
        );

        return [
            'test_id' => Test::inRandomOrder()->value('id'),
            'question_text' => $this->faker->sentence(6),
            'option_a' => $optionA,
            'option_b' => $optionB,
            'option_c' => $optionC,
            'correct_option' => $correctOption,
        ];
    }
}
