<?php

namespace App\Providers;

use App\Models\Sale;
use App\Observers\SaleObserver;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production (Render uses proxy)
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Optional Vite optimization
        Vite::prefetch(concurrency: 3);

        // Register model observers
        Sale::observe(SaleObserver::class);

        // BUG-N02: Configure rate limiting to use database cache explicitly
        $this->configureRateLimiting();
    }

    /**
     * BUG-N02: Configure the rate limiters for the application.
     * Uses database cache to ensure persistence on Render.com
     */
    protected function configureRateLimiting(): void
    {
        // Configure default 'api' rate limiter
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Configure login rate limiter - 5 attempts per minute per IP
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
