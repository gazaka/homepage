# Dockerfile

# Use an official Nginx image as a parent image
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx.conf to the container
COPY nginx.conf /etc/nginx/conf.d/

# Copy our frontend application source code
COPY ./src /usr/share/nginx/html