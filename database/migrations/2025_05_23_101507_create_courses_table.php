<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
           $table->uuid('id')->primary();

            $table->string('name')->unique();
            $table->string('description');
            $table->integer('duration');
            $table->string('image')->nullable();
            $table->string('pdf')->nullable();
            $table->foreignUuid('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('isHidden')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
