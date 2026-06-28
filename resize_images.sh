#!/bin/bash
find works -type f \( -iname \*.png -o -iname \*.jpg -o -iname \*.jpeg \) | while read img; do
    echo "Processing $img..."
    # Determine the new filename with .jpg extension
    dir=$(dirname "$img")
    base=$(basename "$img")
    name="${base%.*}"
    new_img="$dir/$name.jpg"
    
    # Mogrify to resize and convert format
    # The > ensures it only shrinks images larger than 700x500, preserving aspect ratio.
    convert "$img" -resize "700x500>" -quality 95 "$new_img"
    
    # If the original wasn't a jpg, remove it. (Also check if conversion succeeded)
    if [ $? -eq 0 ] && [ "$img" != "$new_img" ]; then
        rm "$img"
    fi
done
echo "All images processed."
