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

# Wait for gateway
echo "   - Gateway Service..."
until curl -s http://localhost:8080/actuator/health &>/dev/null 2>/dev/null || curl -s http://localhost:8080 &>/dev/null; do
    sleep 2
done
echo "     Gateway is ready!"

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Services:"
echo "  Frontend:     http://localhost"
echo "  Gateway:      http://localhost:8080"
echo "  Student API:  http://localhost:8081"
echo "  Faculty API:  http://localhost:8082"
echo "  Event API:     http://localhost:8083"
echo "  MongoDB:       localhost:27017"
echo ""
echo "Useful commands:"
echo "  View logs:    docker compose logs -f"
echo "  Stop:         docker compose down"
echo "  Restart:      docker compose restart"
echo "  Rebuild:      docker compose up -d --build"
