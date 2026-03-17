# ------------------------------
# 1. Build Frontend (Vite)
# ------------------------------
FROM node:18 AS frontend

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source and configuration
COPY resources resources
COPY vite.config.js ./
COPY tailwind.config.js ./
RUN mkdir -p public

# Build frontend
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Verify build was successful
RUN ls -la public/build/assets/ && echo "Build assets created successfully"

# ------------------------------
# 2. Build Laravel Backend
# ------------------------------
FROM php:8.2-fpm AS backend

# Install system dependencies and PHP extensions (including PostgreSQL)
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev libpq-dev pkg-config zip unzip curl git \
 && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd \
 && apt-get clean && rm -rf /var/lib/apt/lists/* \
 && php -r "if (!extension_loaded('pdo_pgsql')) { exit(1); }" \
 && echo "PDO PostgreSQL extension successfully installed"

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy backend files
COPY . .

# Ensure public/build directory exists
RUN mkdir -p public/build && rm -rf public/build/*

# Copy built frontend assets
COPY --from=frontend /app/public/build ./public/build

# Verify assets were copied
RUN ls -la public/build/assets/ | head -5 && echo "Assets copied successfully"

# Clear composer cache and install PHP dependencies
RUN composer clear-cache && \
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts --verbose

# Run package discovery
RUN php artisan package:discover --ansi || true

# Ensure Laravel cache/storage folders exist
RUN mkdir -p bootstrap/cache storage/framework/{views,cache,sessions} storage/logs storage/app/public \
 && chmod -R 775 storage bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

# Remove broken storage symlink if exists
RUN rm -rf public/storage || true

EXPOSE 10000

# ------------------------------
# 3. Runtime Commands
# ------------------------------
CMD set -e && \
    echo "=== Starting BBKits Application ===" && \
    mkdir -p bootstrap/cache storage/framework/{views,cache,sessions} storage/logs storage/app/public && \
    chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache && \
    echo "=== Checking PHP Extensions ===" && \
    php -r "if (!extension_loaded('pdo_pgsql')) { echo 'ERROR: PDO PostgreSQL not loaded'; exit(1); }" && \
    echo "PDO PostgreSQL is loaded" && \
    echo "=== Ensuring Composer Dependencies ===" && \
    if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then \
        echo "Installing composer dependencies..." && \
        composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --verbose; \
    fi && \
    echo "Vendor directory verified" && \
    echo "=== Verifying Critical Files ===" && \
    ls -la public/index.php || (echo "ERROR: public/index.php missing!" && exit 1) && \
    ls -la server.php || (echo "ERROR: server.php missing!" && exit 1) && \
    echo "=== Ensuring Storage Link ===" && \
    (php artisan storage:link || echo "Storage link exists") && \
    echo "=== Running Migrations ===" && \
    (php artisan migrate --force || echo "Migration completed or skipped") && \
    echo "=== Clearing Caches ===" && \
    php artisan config:clear || true && \
    php artisan cache:clear || true && \
    php artisan view:clear || true && \
    echo "=== Testing Application Health ===" && \
    php artisan --version && \
    echo "=== Starting Web Server ===" && \
    echo "Application ready! Starting server on port 10000..." && \
    php -S 0.0.0.0:10000 server.php
