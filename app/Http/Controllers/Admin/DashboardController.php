<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ContactMessage;
use App\Models\GalleryItem;
use App\Models\Media;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // One grouped query for the article counts rather than a separate
        // COUNT(*) per status, then three cheap counts for the other entities.
        $byStatus = Article::query()
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'articles' => (int) $byStatus->sum(),
                'published' => (int) $byStatus->get(ArticleStatus::Published->value, 0),
                'drafts' => (int) $byStatus->get(ArticleStatus::Draft->value, 0),
                'scheduled' => (int) $byStatus->get(ArticleStatus::Scheduled->value, 0),
                'media' => Media::count(),
                'gallery' => GalleryItem::count(),
                'unread' => ContactMessage::where('is_read', false)->count(),
            ],
            'recent' => Article::with('category:id,name_id,name_en')
                ->latest('updated_at')
                ->take(5)
                ->get()
                ->map(fn (Article $article) => [
                    'id' => $article->id,
                    'title_id' => $article->title_id,
                    'status' => $article->status->value,
                    'updated_at' => $article->updated_at?->toIso8601String(),
                    'category' => $article->category?->localized('name'),
                ]),
        ]);
    }
}
