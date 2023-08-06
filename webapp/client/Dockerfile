FROM owasp/modsecurity-crs:3.3.4-nginx-202304160904

ENV NODE_VERSION=18.17.0
RUN apt-get update
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

WORKDIR /client
COPY package*.json ./

RUN npm install

RUN mkdir -p /var/www/alexandre.doneux.eu/html

RUN cd /opt/
RUN apt install git -y
RUN git clone https://github.com/coreruleset/coreruleset

EXPOSE 80 443

ENTRYPOINT ["/bin/sh","-c","npm run build && cp -r /client/build/* /var/www/alexandre.doneux.eu/html && chown root:root /etc/nginx/sites-enabled/alexandre.doneux.eu && nginx -g \"daemon off;\""]