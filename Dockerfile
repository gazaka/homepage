# Use an official Nginx image as a parent image
FROM nginx:alpine

# Copy your website files to the Nginx web root directory
COPY ./src /usr/share/nginx/html