#!/bin/bash

# Create database
echo "Creating database..."
psql -U postgres -c "DROP DATABASE IF EXISTS todo_db;"
psql -U postgres -c "CREATE DATABASE todo_db;"

# Run schema
echo "Setting up schema..."
psql -U postgres -d todo_db -f backend/schema.sql

# Install dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Start the server
echo "Starting the server..."
node server.js 