FROM busybox:latest
ENV PORT=8080

copy ./www /www

HEALTHCHECK CMD nc -z localhost $PORT

# Get secret defined in nais console named JESPER_SIN_GMAPS_API_KEY and write it to .env file in www
# This will be executed when the container starts, allowing the secret to be injected at runtime
CMD echo "httpd started" && \
    echo "$JESPER_SIN_GMAPS_API_KEY" > /www/env.env && \
    trap "exit 0;" TERM INT; httpd -v -p $PORT -h /www -f & wait