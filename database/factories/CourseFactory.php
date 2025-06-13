<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'duration' => 0, 
            'image' => 'null',
            'pdf' => 'null',
            'teacher_id' => User::where('rol', 'teacher')->inRandomOrder()->first()?->id ?? 
                User::factory()->create(['rol' => 'teacher'])->id,

        ];
    }
}
