sudo apt-get update
# common dependencies
sudo apt-get install -y curl build-essential git-core

# postgres
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres psql -c "create user root password 'root'"
sudo -u postgres psql -c "create database root"
sudo -u postgres psql -c "grant all privileges on database root TO root"

# install nginx
sudo apt-get update
sudo apt-get install -y nginx
sudo service nginx start # start nginx
update-rc.d nginx defaults # start nginx on boot
sudo bash -c 'echo "upstream app {
  server 127.0.0.1:3000;
}

server {
  listen 80;

  location / {
    proxy_pass http://app;
  }
}" > /etc/nginx/sites-available/default'
sudo service nginx reload

# install node.js
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
source ~/.bashrc
nvm install iojs
npm i knex -g
