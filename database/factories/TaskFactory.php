<?php

namespace Database\Factories;

use App\Models\Log;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'log_id' => Log::factory(),
            'title' => fake()->sentence(3),
            'body' => fake()->optional()->paragraph(),
            'is_completed' => fake()->boolean(30), // 30%の確率で完了
            'sort_order' => 0,
        ];
    }
}
