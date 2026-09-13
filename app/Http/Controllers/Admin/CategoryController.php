<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categories', [
            'categories' => Category::query()
                ->withCount('articles')
                ->orderBy('name_id')
                ->get()
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name_id' => $category->name_id,
                    'name_en' => $category->name_en,
                    'articles_count' => $category->articles_count,
                ]),
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        Category::create($request->validated());

        return back()->with('success', __('flash.created'));
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return back()->with('success', __('flash.updated'));
    }

    public function destroy(Category $category): RedirectResponse
    {
        // Articles keep their row and lose the category: the foreign key is
        // nullOnDelete, so removing a taxonomy term never takes published
        // content with it.
        $category->delete();

        return back()->with('success', __('flash.deleted'));
    }
}
