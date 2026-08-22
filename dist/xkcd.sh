#!/bin/bash

# disable globbing to prevent ALT text that may contain wildcard characters from resolving in the shell
#     (q.v. Comic 1409 ALT text "SELECT * FROM GHOSTS")
#     (and also the test argument $1)
set -f

# Directory where we save the image and JSON file (HACS default)
save_directory="/config/www/community/xkcd-card-ha/"

# Fallback save_directory for testing or other situations
[ -d "${save_directory}" ] || save_directory="./"

# track latest comic number for a full range of random choices
LATEST_COMIC_NUMBER_FILE="latest_comic_number.txt"
LATEST_COMIC_NUMBER=$(cat ${save_directory}${LATEST_COMIC_NUMBER_FILE} 2> /dev/null)
[ $LATEST_COMIC_NUMBER -eq $LATEST_COMIC_NUMBER 2>/dev/null ] || LATEST_COMIC_NUMBER=3200

# Determine the day of the week
day_of_week=$(date +%u) # +%u gives a numeric representation of the day of the week (1=Monday, ..., 7=Sunday)

# Test mode is triggered by a numeric argument to this shell script
if [ ! -z "$1" ] && [ $1 -eq $1 2>/dev/null ]; then
    # get specific numbered comic (mostly for testing the globbing issue)
    test_comic="$1"
    url="https://xkcd.com/${test_comic}/info.0.json"
    explainurl="https://www.explainxkcd.com/wiki/index.php/${test_comic}:"

# Define the URL based on the day of the week, or if 'random' is provided as an argument
elif [[ "$day_of_week" == "2" || "$day_of_week" == "4" || "$day_of_week" == "6" || "$day_of_week" == "7" || "$1" == "random" ]]; then
    # Generate a random comic number between 1 and $LATEST_COMIC_NUMBER
    random_comic=$((1 + RANDOM % $LATEST_COMIC_NUMBER))
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

# Update latest/highest comic number in stored file
[ $LATEST_COMIC_NUMBER -ge $comic_number 2>/dev/null ] || echo "$comic_number" > ${save_directory}${LATEST_COMIC_NUMBER_FILE}

# Output the saved paths
echo "Image saved to: $local_image_path"
echo "JSON saved to: ${save_directory}xkcd_data.json"
