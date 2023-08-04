# Use an official Node.js runtime as a parent image
FROM node:18.14-alpine as builder

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

FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

##COPY --from=builder /client/build /usr/share/nginx/html

# Expose port 3000 for the application
EXPOSE 80 443

# Start the application -> no more running a node server. We want to run everything on a NGINX server 
#CMD ["npm", "start"]



ENTRYPOINT ["npm", "run", "build", \\
            "cp", "./build", "/usr/share/nginx/html"\\
            "nginx", "-g", "daemon off;"]