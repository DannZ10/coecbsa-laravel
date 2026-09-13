<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProgramStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProgramRequest;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Content/Programs', [
            'programs' => Program::orderBy('position')->orderBy('id')->get(),
            'statuses' => array_column(ProgramStatus::cases(), 'value'),
        ]);
    }

    public function store(ProgramRequest $request): RedirectResponse
    {
        Program::create($request->validated());

        return back()->with('success', __('flash.created'));
    }

    public function update(ProgramRequest $request, Program $program): RedirectResponse
    {
        $program->update($request->validated());

        return back()->with('success', __('flash.updated'));
    }

    public function destroy(Program $program): RedirectResponse
    {
        $program->delete();

        return back()->with('success', __('flash.deleted'));
    }
}
