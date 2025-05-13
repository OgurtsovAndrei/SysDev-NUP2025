#!/bin/bash

# Script to clear the telecom_db database for resetup

echo "Clearing telecom_db database..."

# Check if Docker is running and the container exists
if ! docker ps | grep -q telecom_postgres; then
  echo "Error: telecom_postgres container is not running."
  echo "Please start the container with 'docker-compose up -d' first."
  exit 1
fi

# Connect to PostgreSQL and drop all tables
docker exec telecom_postgres psql -U postgres -d telecom_db -c "
DO \$\$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END \$\$;
"

echo "Database cleared successfully. The application will recreate tables on next startup."