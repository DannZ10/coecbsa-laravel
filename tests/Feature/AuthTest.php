<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_the_panel(): void
    {
        $this->get('/admin')->assertRedirect(route('admin.login'));
    }

    public function test_operator_can_sign_in(): void
    {
        $user = User::factory()->create(['password' => Hash::make('a-long-enough-password')]);

        $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'a-long-enough-password',
        ])->assertRedirect(route('admin.dashboard'));

        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->fresh()->last_login_at);
    }

    public function test_wrong_password_is_rejected(): void
    {
        $user = User::factory()->create(['password' => Hash::make('a-long-enough-password')]);

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'wrong'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    /**
     * is_active is passed to Auth::attempt as a credential, so a deactivated
     * account never reaches a logged-in state even for an instant.
     */
    public function test_deactivated_account_cannot_sign_in(): void
    {
        $user = User::factory()->inactive()->create(['password' => Hash::make('a-long-enough-password')]);

        $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'a-long-enough-password',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_sixth_failed_attempt_is_throttled(): void
    {
        $user = User::factory()->create();

        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->post('/admin/login', ['email' => $user->email, 'password' => 'wrong']);
        }

        $response = $this->post('/admin/login', ['email' => $user->email, 'password' => 'wrong']);

        $response->assertSessionHasErrors('email');
        $this->assertStringContainsString(
            'Terlalu banyak',
            (string) session('errors')->first('email'),
        );
    }

    public function test_editor_cannot_reach_user_management(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/users')
            ->assertForbidden();

        $this->actingAs(User::factory()->create())
            ->post('/admin/users', ['name' => 'X', 'email' => 'x@y.test', 'role' => 'super_admin'])
            ->assertForbidden();
    }

    public function test_super_admin_can_reach_user_management(): void
    {
        $this->actingAs(User::factory()->superAdmin()->create())
            ->get('/admin/users')
            ->assertOk();
    }

    public function test_editor_can_still_reach_the_newsroom(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/news')
            ->assertOk();
    }

    public function test_super_admin_cannot_demote_themselves(): void
    {
        $user = User::factory()->superAdmin()->create();

        $this->actingAs($user)->put("/admin/users/{$user->id}", [
            'name' => $user->name,
            'email' => $user->email,
            'role' => 'editor',
            'is_active' => false,
        ]);

        $user->refresh();

        $this->assertTrue($user->isSuperAdmin());
        $this->assertTrue($user->is_active);
    }
}
