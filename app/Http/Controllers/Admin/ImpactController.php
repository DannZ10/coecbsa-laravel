<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ImpactSdg;
use App\Models\ImpactStat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ImpactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Content/Impact', [
            'stats' => ImpactStat::orderBy('position')->get(),
            'sdgs' => ImpactSdg::orderBy('position')->get(),
        ]);
    }

    /**
     * Replace both lists wholesale.
     *
     * The impact section is a handful of rows edited as one block, so a
     * replace is simpler than tracking per-row create/update/delete — and it
     * cannot leave the two lists half-applied, because it runs in one
     * transaction.
     */
    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'stats' => ['array', 'max:12'],
            'stats.*.stat_key' => ['required', 'string', 'max:60', 'regex:/^[a-z0-9-]+$/'],
            'stats.*.value' => ['required', 'string', 'max:20'],
            'stats.*.label_id' => ['required', 'string', 'max:120'],
            'stats.*.label_en' => ['nullable', 'string', 'max:120'],

            'sdgs' => ['array', 'max:17'],
            'sdgs.*.code' => ['required', 'string', 'max:20'],
            'sdgs.*.label_id' => ['required', 'string', 'max:120'],
            'sdgs.*.label_en' => ['nullable', 'string', 'max:120'],
            'sdgs.*.description_id' => ['required', 'string', 'max:500'],
            'sdgs.*.description_en' => ['nullable', 'string', 'max:500'],
        ]);

        DB::transaction(function () use ($data) {
            ImpactStat::query()->delete();
            foreach ($data['stats'] ?? [] as $position => $stat) {
                ImpactStat::create([...$stat, 'position' => $position]);
            }

            ImpactSdg::query()->delete();
            foreach ($data['sdgs'] ?? [] as $position => $sdg) {
                ImpactSdg::create([...$sdg, 'position' => $position]);
            }
        });

        return back()->with('success', __('flash.saved'));
    }
}
