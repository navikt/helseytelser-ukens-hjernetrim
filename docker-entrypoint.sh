#!/bin/sh

# Write runtime environment variable to file
echo "${SOME_KEY}" > /usr/share/nginx/html/env.env

# Start nginx
nginx -g "daemon off;"