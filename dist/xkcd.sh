#!/bin/bash

# Directory where we save the image and JSON file (HACS default)
save_directory="/config/www/community/xkcd-card-ha/"

# Determine the day of the week
day_of_week=$(date +%u) # +%u gives a numeric representation of the day of the week (1=Monday, ..., 7=Sunday)

# Define the URL based on the day of the week
if [[ "$day_of_week" == "2" || "$day_of_week" == "4" || "$day_of_week" == "6" || "$day_of_week" == "7" ]]; then
    # Generate a random comic number between 1 and 2000
    random_comic=$((1 + RANDOM % 2000))
    url="https://xkcd.com/${random_comic}/info.0.json"
    explainurl="https://www.explainxkcd.com/wiki/index.php/${random_comic}:"
else
    url="https://xkcd.com/info.0.json"
    explainurl="https://explainxkcd.com/?"
fi

# Fetch the data
data=$(curl -s $url)

# Extract the image URL, title, alt text, comic number, and date
image_url=$(echo $data | jq -r '.img')
title=$(echo $data | jq -r '.title')
safe_title=$(echo $data | jq -r '.safe_title')
alt_text=$(echo $data | jq -r '.alt')
comic_number=$(echo $data | jq -r '.num')
comic_date=$(echo $data | jq -r '.year')"-"$(echo $data | jq -r '.month')"-"$(echo $data | jq -r '.day')

# Download the image
image_name=$(basename $image_url)
curl -s $image_url -o "${save_directory}xkcd.png"

# Complete the explain XKCD URL with safe_title
explainurl="${explainurl}"_"${safe_title}"

# Local path to the image
local_image_path="${save_directory}xkcd.png"

# Create a JSON object
json_output=$(jq -n \
                  --arg img "$local_image_path" \
                  --arg title "$title" \
                  --arg alt "$alt_text" \
                  --arg num "$comic_number" \
                  --arg safe "$safe_title" \
                  --arg date "$comic_date" \
                  --arg exp "$explainurl" \
                  '{image_url: $img, title: $title, alt_text: $alt, explain_url: $exp, comic_number: $num, date: $date}')

# Save the JSON to a file
echo $json_output > "${save_directory}xkcd_data.json"

# Output the saved paths
echo "Image saved to: $local_image_path"
echo "JSON saved to: ${save_directory}xkcd_data.json"
