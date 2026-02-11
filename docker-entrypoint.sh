#!/bin/sh

# Write runtime environment variable to file
echo "${JESPER_SIN_GMAPS_API_KEY}" > /usr/share/nginx/html/env.env

# Start nginx
nginx -g "daemon off;"