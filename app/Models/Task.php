<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'task_date',
        'text',
        'done',
        'category',
        'priority',
    ];

    protected $casts = [
        'done' => 'boolean',
        'task_date' => 'date:Y-m-d',
    ];
}
