#!/bin/bash

# Directory where you want to save the image and JSON file
save_directory="/local/community/xkcd-card/"

# URL of the XKCD JSON
url="https://xkcd.com/info.0.json"

# Fetch the data
data=$(curl -s $url)

# Extract the image URL, title, and alt text
image_url=$(echo $data | jq -r '.img')
title=$(echo $data | jq -r '.title')
alt_text=$(echo $data | jq -r '.alt')

# Download the image
image_name=$(basename $image_url)
curl -s $image_url -o "${save_directory}xkcd.png"

# Local path to the image
local_image_path="${save_directory}xkcd.png"

# Create a JSON object
json_output=$(jq -n \
                  --arg img "$local_image_path" \
                  --arg title "$title" \
                  --arg alt "$alt_text" \
                  '{image_url: $img, title: $title, alt_text: $alt}')

# Save the JSON to a file
echo $json_output > "${save_directory}xkcd_data.json"
# Output the saved paths
echo "Image saved to: $local_image_path"
echo "JSON saved to: ${save_directory}xkcd_data.json"
