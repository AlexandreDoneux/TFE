# list of commands written during install of WAF : libModSecurity and ModSecurity-nginx

# libModSecurity

apt-get install g++ apt-utils autoconf automake build-essential libcurl4-openssl-dev libgeoip-dev liblmdb-dev libpcre++-dev libtool libxml2-dev libyajl-dev pkgconf wget zlib1g-dev -y


cd /opt/
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
./configure --add-dynamic-module=/opt/ModSecurity-nginx --with-compat --with-openssl=/usr/include/openssl/ # with-openssl -> opsshield tutorial
#make
make modules # this instead of make ?
make install  # not present in opsshield tutorial
cp objs/ngx_http_modsecurity_module.so /usr/share/nginx/modules/ # copy to modules directory -> why ? Will NGINX find it automatically ? Does is replace the load_module in nginx.conf ?
#echo "load_module modules/ngx_http_modsecurity_module.so;" > /etc/nginx/modules-enabled/50-mod-http-modsecurity.conf 


# /usr/lib/nginx/modules/ -> in nginx -V => modules-path


# OWASP security rule set -> download in source code and use volume for containers ????, simply have the .conf file ???
cd /opt/
git clone https://github.com/coreruleset/coreruleset



# list nginx modules : nginx -V 2>&1 | tr -- - '\n' | grep _module
