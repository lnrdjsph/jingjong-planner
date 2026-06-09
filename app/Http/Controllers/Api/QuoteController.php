<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class QuoteController extends Controller
{
    public function fetchQuote(Request $request)
    {
        $dateStr = now()->format('l, F j');

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'x-api-key' => env('ANTHROPIC_API_KEY'),
        ])->post('https://api.anthropic.com/v1/messages', [
            'model' => 'claude-3-sonnet-20240229',
            'max_tokens' => 300,
            'messages' => [
                [
                    'role' => 'user',
                    'content' => "Search for a real inspirational quote popular today ({$dateStr}). Return ONLY raw JSON, no markdown: {\"quote\":\"text\",\"author\":\"Name\",\"theme\":\"one word like courage/joy/growth/dreams/peace\"}"
                ]
            ]
        ]);

        return response()->json($response->json());
    }
}
