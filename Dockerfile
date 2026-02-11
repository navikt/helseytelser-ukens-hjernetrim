FROM nginx:alpine

COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy website files
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]