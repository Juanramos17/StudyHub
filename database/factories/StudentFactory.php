<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        $completionDate = $this->faker->optional(0.7)->date();

        if($completionDate === null) {
            $status = true;
        } else {
            $status = false;
        }

        return [
            'user_id' => User::where('rol', 'student')->inRandomOrder()->value('id') 
             ?? User::factory()->create(['rol' => 'student'])->id,
            'course_id' => Course::inRandomOrder()->value('id'),
            'enrollment_date' => $this->faker->date(),
            'completion_date' => $completionDate,
            'status' => $status, 
        ];
    }
}
