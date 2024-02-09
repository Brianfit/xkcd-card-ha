#!/bin/bash

# Since XKCD only posts new comics on Monday, Wednesday, and Friday we are going to pull random comics on the other days
# Directory where we save the image and JSON file (HACS default)
save_directory="/config/www/community/xkcd-card-ha/"

# Determine the day of the week
day_of_week=$(date +%u) # +%u gives a numeric representation of the day of the week (1=Monday, ..., 7=Sunday)

# Define the URL based on the day of the week
if [[ "$day_of_week" == "2" || "$day_of_week" == "4" || "$day_of_week" == "6" || "$day_of_week" == "7" ]]; then
    # Generate a random comic number between 1 and 2000
    random_comic=$((1 + RANDOM % 2000))
    url="https://xkcd.com/${random_comic}/info.0.json"
else
    url="https://xkcd.com/info.0.json"
fi

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

