# Deploying Evently to Raspberry Pi

This guide walks you through deploying Evently (frontend + microservices + MongoDB) to your Raspberry Pi using Docker.

## Prerequisites

- Raspberry Pi with Raspberry Pi OS (or any Debian-based OS)
- Docker Engine installed
- Docker Compose installed
- Cloudflare Tunnel already configured on your Pi

## Architecture

```
                    ┌─────────────┐
                    │  Cloudflare │
                    │   Tunnel    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Nginx     │
                    │  (Frontend) │
                    │   Port 80   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Gateway   │
                    │  Port 8080  │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │  Student  │   │  Faculty  │   │   Event   │
    │  Service  │   │  Service  │   │  Service  │
    │  Port 8081│   │  Port 8082│   │  Port 8083│
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │               │               │
          └───────────────┼───────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   MongoDB   │
                   │  Port 27017│
                   └─────────────┘
```

## Quick Start

### 1. Transfer files to Pi

```bash
# From your development machine
rsync -avz --exclude='node_modules' --exclude='target' \
  /path/to/Evently/ pi@your-pi:/home/pi/Evently/
```

### 2. SSH into your Pi and navigate to the project

```bash
ssh pi@your-pi
cd ~/Evently
```

### 3. Run the deployment script

```bash
./deploy.sh
```

This will:
- Stop any existing containers
- Build all Docker images (first run takes ~10-15 minutes on Pi due to Maven builds)
- Start all services
- Wait for MongoDB to be healthy before starting dependent services

## Manual Commands

If you prefer to run things manually:

```bash
# Build and start everything
docker compose up -d --build

# View logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f gateway-service

# Stop all services
docker compose down

# Restart a specific service
docker compose restart gateway-service

# Rebuild a specific service
docker compose up -d --build gateway-service
```

## Cloudflare Tunnel Setup

### Option 1: Temporary tunnel (quick test)

```bash
cloudflared tunnel --url http://localhost:80
```

This gives you a random URL like `https://random-name.trycloudflare.com`

### Option 2: Permanent tunnel (recommended)

1. Go to [Cloudflare Zero Trust Dashboard](https://dash.teams.cloudflare.com/)
2. Create a new tunnel
3. Name it `evently`
4. Copy the tunnel token
5. Create a config file on your Pi:

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

```yaml
tunnel: YOUR-TUNNEL-ID
credentials-file: /etc/cloudflared/tunnel-credentials.json

ingress:
  - hostname: evently.yourdomain.com
    service: http://localhost:80
  - service: http_status:404
```

6. Start the tunnel:

```bash
cloudflared service install YOUR-TUNNEL-TOKEN
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

## Verifying Deployment

### Check service health

```bash
# All services running?
docker compose ps

# Check gateway logs
docker compose logs gateway-service

# Test MongoDB connection
docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Test from your browser

1. Open `http://<your-pi-ip>` locally
2. Or open `https://evently.yourdomain.com` via Cloudflare

## Troubleshooting

### Services won't start

```bash
# Check logs
docker compose logs

# Rebuild without cache
docker compose build --no-cache
docker compose up -d
```

### MongoDB connection issues

```bash
# Check if MongoDB is running
docker compose ps mongodb

# View MongoDB logs
docker compose logs mongodb

# Wait longer for MongoDB to initialize
docker compose up -d
docker compose logs -f mongodb
```

### Frontend 502/504 errors

- The gateway service might not be ready yet
- Wait 30 seconds after starting, then refresh

### Slow builds on Pi

First-time builds on Raspberry Pi take long because Maven compiles Java services. For faster iterations:

1. Build once with `--build`
2. For code changes, rebuild only the affected service:

```bash
docker compose up -d --build event-service
```

### View resource usage

```bash
docker stats
```

## Data Persistence

MongoDB data is stored in a Docker volume named `evently_mongodb_data`. This persists across container restarts.

To completely reset data:
```bash
docker compose down -v  # WARNING: deletes all data
docker compose up -d
```

## Exposed Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 by default | React app via Nginx |
| Gateway | Not exposed | Internal Docker network only |
| Student | Not exposed | Internal Docker network only |
| Faculty | Not exposed | Internal Docker network only |
| Event | Not exposed | Internal Docker network only |
| MongoDB | Not exposed | Internal Docker network only |

Only port 80 needs to be exposed via Cloudflare Tunnel.

If port `80` is already in use on your Pi, choose another host port:

```bash
FRONTEND_PORT=8088 docker compose up -d --build
```

Then point Cloudflare Tunnel at `http://localhost:8088`.
