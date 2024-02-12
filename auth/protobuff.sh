#!/bin/bash

# Directory where the proto files are located
PROTO_DIR="src"

# Directory where you want to move the interface files
INTERFACE_DIR="interfaces"

# Record the current time
start_time=$(date +%s)

# Run the tsproto command
npm run proto:generate

# Find all .ts files in the specified directory that were modified after the script start time
find $PROTO_DIR -type f -name "*.ts" -newermt "@$start_time" | while read file; do
    # Check if the file is not a controller or service file
    if [[ ! $file =~ \.controller\.ts$ ]] && [[ ! $file =~ \.service\.ts$ ]]; then
        # Directory of the current file
        dir=$(dirname "$file")

        # New file name with .interface.ts extension
        new_file="$(basename "$file" .ts).interface.ts"

        # Create the interfaces directory if it doesn't exist
        mkdir -p "$dir/$INTERFACE_DIR"

        # Move and rename the file
        mv "$file" "$dir/$INTERFACE_DIR/$new_file"
    fi
done
