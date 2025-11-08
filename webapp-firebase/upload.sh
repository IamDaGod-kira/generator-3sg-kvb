#!/bin/bash

repo="IamDaGod-kira/generator-3s-kvb"

# Loop through each line of the .env file
while IFS= read -r line; do
    # Skip comments and empty lines
    if [[ ! "$line" =~ ^\s*# && "$line" =~ ^\s*([^=]+)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        
        # Remove leading/trailing whitespaces from key and value
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        
        # Set the GitHub secret
        gh secret set "$key" -b"$value" -R "$repo"
    fi
done < .env
