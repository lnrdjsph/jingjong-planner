<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // GET /api/tasks?date=2025-01-13
    public function index(Request $request)
    {
        $query = Task::query();

        if ($request->has('date')) {
            $query->whereDate('task_date', $request->date);
        }

        if ($request->has('start') && $request->has('end')) {
            $query->whereBetween('task_date', [$request->start, $request->end]);
        }

        return response()->json($query->orderBy('created_at')->get());
    }

    // POST /api/tasks
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_date' => 'required|date',
            'text'      => 'required|string|max:255',
            'category'  => 'in:work,personal,shopping,health',
            'priority'  => 'in:low,medium,high',
        ]);

        $task = Task::create($validated);
        return response()->json($task, 201);
    }

    // PATCH /api/tasks/{id}
    public function update(Request $request, Task $task)
    {
        $task->update($request->only(['text', 'done', 'category', 'priority']));
        return response()->json($task);
    }

    // DELETE /api/tasks/{id}
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['deleted' => true]);
    }
}
