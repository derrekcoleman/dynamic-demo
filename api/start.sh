#!/bin/bash

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo "Composer is not installed. Please install it first: https://getcomposer.org/download/"
    exit 1
fi

# Install dependencies if vendor directory doesn't exist
if [ ! -d "vendor" ]; then
    echo "Installing dependencies..."
    composer install
fi

# Start the PHP server
echo "Starting PHP server on localhost:9000..."
php -S localhost:9000 