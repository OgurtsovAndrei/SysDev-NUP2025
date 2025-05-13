#!/bin/bash

# Script to completely reset the PostgreSQL database by removing the Docker volume

echo "Resetting PostgreSQL database..."

# Stop the containers if they are running
echo "Stopping containers..."
docker compose stop

# Remove the containers
echo "Removing containers..."
docker compose rm -f postgres

# Remove the volume
echo "Removing database volume..."
docker volume rm my_telecom_project_postgres_data

# Start the database again
echo "Starting fresh database..."
docker compose up -d postgres

echo "Database has been completely reset!"
