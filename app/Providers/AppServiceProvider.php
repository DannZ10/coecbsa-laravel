<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Managing operators is the one capability an editor must not have.
        // Defined as a gate rather than checked inline so the route, the
        // controller and the sidebar all read the same rule.
        Gate::define('manage-users', fn (User $user) => $user->isSuperAdmin());
    }
}
