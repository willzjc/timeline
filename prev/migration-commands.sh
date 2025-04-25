# Create the prev directory if it doesn't exist
mkdir -p prev

# Move JavaScript files
mv timeline.js prev/
mv animations.js prev/
mv app.js prev/ 2>/dev/null || echo "No app.js found"

# Move HTML file (we'll use React's index.html in public/ instead)
mv index.html prev/

# Move CSS files if they exist
mv styles.css prev/ 2>/dev/null || echo "No styles.css found"
mv map-styles.css prev/ 2>/dev/null || echo "No map-styles.css found"

# Move config file (we'll create a new one for React)
if [ -f config.js ]; then
    # Copy instead of move so we can reference API keys
    cp config.js prev/
    echo "Config file copied to prev/ - you may need to update the React version"
fi

# Display completion message
echo "Legacy files moved to the prev/ directory"
echo "React project is now ready for development"
