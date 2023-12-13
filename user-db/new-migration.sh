#!/bin/bash

migrations_folder="./migrations"

# Get the current timestamp
timestamp=$(date +"%Y%m%d%H%M%S")

# Get the name of the migration
echo "Enter the name of the migration: "
read migration_name

mkdir -p "$migrations_folder"

# Create a new migration file name
migration_file="${migrations_folder}/${timestamp}_${migration_name}.sql"

# Create the new migration file
touch "$migration_file"

# Insert the basic structure inside the migration file
echo "BEGIN;" >> "$migration_file"
echo "" >> "$migration_file"
echo "-- Add your migration SQL statements here" >> "$migration_file"
echo "" >> "$migration_file"
echo "COMMIT;" >> "$migration_file"
