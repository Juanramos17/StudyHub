<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'rol' => 'admin',
            'password' => 'password'
        ]);

        User::factory(10)->create();


        $this->call([
            CourseSeeder::class,
            StudentSeeder::class,
            TestSeeder::class,
            QuestionSeeder::class,
            StadisticSeeder::class,
            TestEvaluationSeeder::class,
            FavoriteSeeder::class,
            RatingSeeder::class,
        ]);
    }
}
