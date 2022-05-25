<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            return response()->json($user);
        }

        return response()->json([
            'errors' => [
                'email' => 'The provided credentials do not match our records.',
            ]
        ], 422);
    }

    public function register(Request $request)
    {
        $credentials = $request->validate([
            'name' => ['string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        $credentials['password'] = bcrypt($credentials['password']);
        $user = User::create($credentials);
        return response()->json([$user, 'message' => 'User created successfully.', 'status' => 201]);
    }

    public function logout(Request $request)
    {
        $request->session()->invalidate();

        return response()->json(['message' => 'Logged out successfully.', 'status' => 'success']);
    }
}
