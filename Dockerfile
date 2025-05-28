# Multi-stage build for Soft Mobility Spacetime Maps
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY frontend/package*.json ./
COPY frontend/tsconfig.json ./
COPY frontend/vite.config.ts ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./

# Install dependencies with optimizations
RUN npm ci --only=production=false --no-audit --no-fund

# Copy source code and assets
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/index.html ./

# Build the application with optimizations
ENV NODE_ENV=production
RUN npm run build

# Production stage with optimized Nginx
FROM nginx:alpine AS production

# Install curl and other utilities for healthcheck and optimization
RUN apk add --no-cache \
    curl \
    gzip \
    && rm -rf /var/cache/apk/*

# Copy optimized nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression for better performance
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/wasm
        image/svg+xml;

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff";
    }

    # Special handling for soft mobility data files
    location ~* \.(json)$ {
        expires 1d;
        add_header Cache-Control "public, must-revalidate";
        add_header Access-Control-Allow-Origin "*";
    }

    # Handle client-side routing for SPA
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Security headers optimized for soft mobility app
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self';" always;

    # Optimize for soft mobility visualization performance
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        # Enable CORS for asset loading
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
    }

    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a non-root user for security
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-user -g nginx-user nginx-user

# Set proper permissions
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    chown -R nginx-user:nginx-user /etc/nginx/conf.d

# Switch to non-root user
USER nginx-user

# Add comprehensive health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Add labels for better container management
LABEL maintainer="Soft Mobility Team"
LABEL description="Soft Mobility Spacetime Maps - Production"
LABEL version="1.0"

# Start nginx with optimized configuration
CMD ["nginx", "-g", "daemon off;"] 