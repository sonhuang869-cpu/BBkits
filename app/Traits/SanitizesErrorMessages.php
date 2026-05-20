<?php

namespace App\Traits;

/**
 * SECURITY FIX: Trait to sanitize error messages before logging or returning to clients.
 * Prevents exposure of sensitive information like database paths, credentials, or internal details.
 */
trait SanitizesErrorMessages
{
    /**
     * Get a safe error message for client responses.
     * Never expose raw exception messages to clients.
     */
    protected function getSafeErrorMessage(\Throwable $e, string $genericMessage): string
    {
        // In production, always return generic message
        if (!config('app.debug')) {
            return $genericMessage;
        }

        // In debug mode, return sanitized message (still remove sensitive patterns)
        return $this->sanitizeMessage($e->getMessage());
    }

    /**
     * Get sanitized data for logging.
     * Removes sensitive information before writing to logs.
     */
    protected function getSafeLogContext(\Throwable $e, array $additionalContext = []): array
    {
        return array_merge([
            'exception_class' => get_class($e),
            'message' => $this->sanitizeMessage($e->getMessage()),
            'code' => $e->getCode(),
            'file' => $this->sanitizePath($e->getFile()),
            'line' => $e->getLine(),
            // Don't log full stack trace - it exposes too much
        ], $additionalContext);
    }

    /**
     * Sanitize an error message by removing sensitive patterns.
     */
    protected function sanitizeMessage(string $message): string
    {
        // Remove potential file paths
        $message = preg_replace('/\/[a-zA-Z0-9_\-\/\.]+\.(php|env|json|sql)/', '[PATH_REDACTED]', $message);

        // Remove potential database credentials
        $message = preg_replace('/password["\']?\s*[:=]\s*["\']?[^"\';\s]+/i', 'password=[REDACTED]', $message);

        // Remove potential API keys/tokens
        $message = preg_replace('/([a-zA-Z_]*(?:key|token|secret|password|credential)[a-zA-Z_]*)["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_\-]+/i', '$1=[REDACTED]', $message);

        // Remove SQL query details
        $message = preg_replace('/SQLSTATE\[[^\]]+\].*$/s', 'Database error occurred', $message);

        // Remove IP addresses
        $message = preg_replace('/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/', '[IP_REDACTED]', $message);

        return $message;
    }

    /**
     * Sanitize file paths in logs.
     */
    protected function sanitizePath(string $path): string
    {
        // Only show the relative path from app root
        $basePath = base_path();
        if (str_starts_with($path, $basePath)) {
            return substr($path, strlen($basePath) + 1);
        }
        return basename($path);
    }

    /**
     * Log an error safely without exposing sensitive data.
     */
    protected function logErrorSafely(string $context, \Throwable $e, array $additionalData = []): void
    {
        \Log::error($context, $this->getSafeLogContext($e, $additionalData));
    }
}
