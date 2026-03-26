#!/bin/bash
# Studio Macnas — Standardized Setup & Environment Guard
# 🚨 ALWAYS USE UTF-8 🚨

echo "--- Studio Macnas Setup ---"

# Ensure UTF-8 in shell session
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Check for .env.local
if [ ! -f "application/.env.local" ]; then
  echo "Creating .env.local from example..."
  cp application/.env.example application/.env.local
else
  echo ".env.local already exists."
fi

# Navigate to application
cd application

# Install dependencies
echo "Installing dependencies..."
npm install

# Run the encoding and types fix
echo "Running structural sanity checks (UTF-8 enforcement)..."
npm run fix:types

echo "--------------------------"
echo "✅ Environment is READY."
echo "Use 'npm run dev' to start the dashboard."
echo "--------------------------"
