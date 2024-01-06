#!/bin/bash

docker compose down
docker volume rm api_data    
docker compose up -d

# Need to wait for the database to start
sleep 10

# Check if the user_database service is healthy
while [[ "$(docker ps --filter "name=user_database" --format "{{.Status}}")" != *"healthy"* ]]; do
    sleep 1
done

chmod a+x ./apply-migrations.sh
./apply-migrations.sh