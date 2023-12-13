#!/bin/bash

docker compose down
docker volume rm api_data    
docker compose up -d
chmod a+x ./apply-migrations.sh
./apply-migrations.sh