<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PartnerRequest;
use App\Models\Partner;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Content/Partners', [
            'partners' => Partner::orderBy('position')->orderBy('id')->get(),
            // Offered as datalist suggestions so a new partner joins an
            // existing group instead of inventing a near-duplicate label.
            'groups' => Partner::query()
                ->select('group_label_id')
                ->distinct()
                ->orderBy('group_label_id')
                ->pluck('group_label_id'),
        ]);
    }

    public function store(PartnerRequest $request): RedirectResponse
    {
        Partner::create($request->validated());

        return back()->with('success', __('flash.created'));
    }

    public function update(PartnerRequest $request, Partner $partner): RedirectResponse
    {
        $partner->update($request->validated());

        return back()->with('success', __('flash.updated'));
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        $partner->delete();

        return back()->with('success', __('flash.deleted'));
    }
}
