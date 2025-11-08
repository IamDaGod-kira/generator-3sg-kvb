#!/bin/bash

repo="IamDaGod-kira/generator-3s-kvb"
output_file=".env"

# Ensure the output file is empty before writing to it
> "$output_file"

# Fetch the list of secrets in the repository
secrets=$(gh secret list -R "$repo" --json name -q ".[].name")

# Loop through each secret and fetch its value
for secret in $secrets; do
    value=$(gh secret view "$secret" -R "$repo" --json value -q ".value")
    
    # Write to the .env file in KEY=VALUE format
    echo "$secret=$value" >> "$output_file"
done

echo "All secrets have been downloaded to $output_file"
