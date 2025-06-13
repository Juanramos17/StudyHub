<?php

namespace Database\Seeders;

use App\Models\TestEvaluation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestEvaluationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TestEvaluation::query()->delete();

        TestEvaluation::factory()->count(10)->create();
    }
}
