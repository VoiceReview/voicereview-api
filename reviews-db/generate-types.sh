#!/bin/bash

# Create the bin folder
mkdir -p ./bin

# Load the environment variables
source ../.env

# check the .env variables


pnpm pg-to-ts generate -c postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5433/$POSTGRES_DB_REVIEW -o ./bin/database.types.ts