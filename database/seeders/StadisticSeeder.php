<?php

namespace Database\Seeders;

use App\Models\Stadistic;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StadisticSeeder extends Seeder
{
    public function run(): void
    {
        Stadistic::query()->delete();

        Stadistic::factory()->count(10)->create();
    }
}
