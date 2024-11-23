#!/bin/bash

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it first."
    exit 1
fi

# Source images
DARK_SOURCE="public/guthmann.dev-dark.svg"
TEMP_PNG="temp-source.png"

# Theme colors
DARK_BG="#1A1B1E"

# Output directory
OUTPUT_DIR="public"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Convert SVG to high-res PNG for processing
magick "$DARK_SOURCE" -background none -resize 1024x1024 "$TEMP_PNG"

# Generate Android icons
magick "$TEMP_PNG" -resize 192x192 "$OUTPUT_DIR/android-chrome-192x192.png"
magick "$TEMP_PNG" -resize 512x512 "$OUTPUT_DIR/android-chrome-512x512.png"

# Generate Apple Touch Icon
magick "$TEMP_PNG" -resize 180x180 -background white -flatten "$OUTPUT_DIR/apple-touch-icon.png"

# Generate favicon.ico (multiple sizes)
magick "$TEMP_PNG" -resize 16x16 "$OUTPUT_DIR/favicon-16x16.png"
magick "$TEMP_PNG" -resize 32x32 "$OUTPUT_DIR/favicon-32x32.png"
magick "$TEMP_PNG" -resize 48x48 "$OUTPUT_DIR/favicon-48x48.png"
magick "$TEMP_PNG" -resize 16x16 favicon-16.png
magick "$TEMP_PNG" -resize 32x32 favicon-32.png
magick "$TEMP_PNG" -resize 48x48 favicon-48.png
magick favicon-16.png favicon-32.png favicon-48.png "$OUTPUT_DIR/favicon.ico"
rm favicon-16.png favicon-32.png favicon-48.png

# Generate Open Graph image
magick -size 1200x630 xc:"$DARK_BG" \
  \( "$DARK_SOURCE" -resize 400x400 \) -gravity center -composite \
  "$OUTPUT_DIR/og-image.png"

# Clean up
rm "$TEMP_PNG"

echo "Icons generated successfully!"
