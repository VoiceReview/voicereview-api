#!/bin/bash

# Load environment variables from .env file
# Should contain the following variables:
# - POSTGRES_USER
# - POSTGRES_PASSWORD
# - POSTGRES_DB_REVIEW
if [ -f ../.env ]; then
    source ../.env
else
    echo "Error: .env file not found. Please create one with the required variables."
    exit 1
fi

# Directory containing your migration files
MIGRATION_DIR="migrations"
DOCKER_CONTAINER_NAME="reviews_database"

calculate_checksum() {
    sha256sum "$1" | awk '{print $1}'
}

for migration_file in "$MIGRATION_DIR"/*.sql; do
    # Calculate the checksum of the migration file
    migration_file_checksum=$(calculate_checksum "$migration_file")

    # Check if the migration has a checksum in the database
    migration_checksum=$(docker exec "$DOCKER_CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB_REVIEW" -c "SELECT checksum FROM private.migrations WHERE name = '$migration_file'" -t | tr -d '[:space:]')

    # If the migration has a checksum, compare it with the checksum of the file
    if [ -n "$migration_checksum" ]; then
        if [ "$migration_file_checksum" != "$migration_checksum" ]; then
            echo "Migration $migration_file has changed. Please revert the changes or delete the migration from the database."
            exit 1
        fi
        
        # If the checksums match, skip the migration
        continue
    fi

    echo "Applying migration: $migration_file"

    # Apply the migration and capture the output
    migration_output=$(docker exec -i "$DOCKER_CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB_REVIEW" < "$migration_file" 2>&1)

    # Check if the output contains "ERROR:"
    if echo "$migration_output" | grep -q "ERROR:"; then
        echo "Error occurred during migration. Details: $migration_output"
        exit 1
    fi

    # Add the migration to the database
    docker exec "$DOCKER_CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB_REVIEW" -c "INSERT INTO private.migrations (name, checksum) VALUES ('$migration_file', '$migration_file_checksum')"
done
