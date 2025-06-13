<?php

namespace Database\Factories;

use App\Models\Test;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TestFactory extends Factory
{
    protected $model = Test::class;

    public function definition(): array
{
    return [
        'name' => $this->faker->sentence(3),
        'course_id' => Course::inRandomOrder()->value('id'),
        'duration' => $this->faker->numberBetween(30, 180), 
        'number_of_questions' => $this->faker->numberBetween(5, 50),
    ];
}

public function configure(): static
{
    return $this->afterCreating(function ($test) {
        $course = $test->course;
        if ($course) {
            $course->duration += $test->duration;
            $course->save();
        }
    });
}
}
