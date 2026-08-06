<?php

namespace Database\Seeders;

use App\Models\Log;
use App\Models\User;
use App\Models\Task;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Log::factory()
            ->count(30)
            ->for($user)
            ->create();

        Log::all()->each(function ($log) {
            Task::factory()
                ->count(rand(3, 8))
                ->for($log)
                ->create();
        });
    }
}
