# Use an official Node.js runtime as a parent image
FROM node:18.14-alpine as builder


RUN apk update
RUN apk add nginx
#RUN ufw allow 'Nginx Full'  #Inside of a container, all ports are open by default to other containers on the same docker network. There is no need to run the ufw command, and it is not shipped in images since permissions to change the network are not granted by default (

# Set the working directory to /app
WORKDIR /client

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
#COPY . .

# Build the React app to use for NGINX
##RUN npm run build

##FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*
RUN mkdir /var/www/alexandre.doneux.eu/html

##COPY --from=builder /client/build /usr/share/nginx/html

# Expose port 3000 for the application
EXPOSE 80 443

# Start the application -> no more running a node server. We want to run everything on a NGINX server 
#CMD ["npm", "start"]


# The -g option of NGINX is used for specifying NGINX flags, daemon off in this case.
ENTRYPOINT ["/bin/sh","-c","npm run build && cp -r /client/build /var/www/alexandre.doneux.eu/html && nginx -g \"daemon off;\""]