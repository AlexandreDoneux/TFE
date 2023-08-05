# list of commands written during install of WAF : libModSecurity and ModSecurity-nginx

# libModSecurity

apt-get install g++ apt-utils autoconf automake build-essential libcurl4-openssl-dev libgeoip-dev liblmdb-dev libpcre++-dev libtool libxml2-dev libyajl-dev pkgconf wget zlib1g-dev -y

# need "cd /opt/"

git clone https://github.com/SpiderLabs/ModSecurity
cd ModSecurity/
git submodule init
git submodule update
sh build.sh
./configure --with-pcre2
make
make install



# ModSecurity-nginx -> needs to be tested
cd /opt/
git clone https://github.com/SpiderLabs/ModSecurity-nginx
wget http://nginx.org/download/nginx-1.18.0.tar.gz # why this ?
tar -xvzf nginx-1.18.0.tar.gz # why this ?
cd /opt/nginx-1.18.0
./configure --add-dynamic-module=/opt/ModSecurity-nginx --with-compat
make
make install


# OWASP security rule set -> download in source code and use volume for containers ????, simply have the .conf file ???
cd /opt/
git clone https://github.com/coreruleset/coreruleset



# list nginx modules : nginx -V 2>&1 | tr -- - '\n' | grep _module
