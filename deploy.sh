#!/bin/bash
set -e

echo "=== Evently Deployment Script ==="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "ERROR: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "1. Stopping existing containers..."
docker compose down 2>/dev/null || true

echo "2. Building and starting all services..."
docker compose up -d --build

echo ""
echo "3. Waiting for services to be healthy..."
echo ""

# Wait for MongoDB
echo "   - MongoDB..."
until docker compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &>/dev/null; do
    sleep 2
done
echo "     MongoDB is ready!"

# Wait for frontend
FRONTEND_PORT="${FRONTEND_PORT:-80}"
echo "   - Frontend on port ${FRONTEND_PORT}..."
until curl -s "http://localhost:${FRONTEND_PORT}" &>/dev/null; do
    sleep 2
done
echo "     Frontend is reachable!"

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Services:"
echo "  Frontend:     http://localhost:${FRONTEND_PORT}"
echo "  Backend APIs: internal Docker network only"
echo "  MongoDB:      internal Docker network only"
echo ""
echo "Useful commands:"
echo "  View logs:    docker compose logs -f"
echo "  Stop:         docker compose down"
echo "  Restart:      docker compose restart"
echo "  Rebuild:      docker compose up -d --build"
