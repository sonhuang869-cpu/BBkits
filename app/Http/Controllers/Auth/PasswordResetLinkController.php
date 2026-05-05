<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * BUG-D04: Always return same response regardless of email existence
     * to prevent email enumeration attacks (OWASP ASVS V3.2 compliance)
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Attempt to send the password reset link
        // We ignore the result to prevent email enumeration
        Password::sendResetLink(
            $request->only('email')
        );

        // BUG-D04: Always return the same generic success message
        // regardless of whether the email exists in the system
        // This prevents attackers from enumerating valid emails
        return back()->with('status', 'Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha.');
    }
}
