-- init.sql
-- Create the "private" schema if it does not exist
CREATE SCHEMA IF NOT EXISTS private;

-- Switch to the "private" schema
SET search_path TO private;

-- Create the migrations table
CREATE TABLE IF NOT EXISTS migrations (
    name text PRIMARY KEY,
    created_at TIMESTAMP DEFAULT current_timestamp,
    checksum VARCHAR(64) -- sha256
);

-- Switch back to the default schema if needed
SET search_path TO public;