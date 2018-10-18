# WTC-Console

This project uses [Django React/Redux Base Project](https://github.com/Seedstars/django-react-redux-base) from Seedstarts as a boilerplate. Please refer to their github for the complete list of technologies used.


Here are the main tools whose knowledge is useful to contribute:

**Frontend**

* [React](https://github.com/facebook/react)
* [React Router](https://github.com/ReactTraining/react-router) Declarative routing for React
* [Webpack](http://webpack.github.io) for bundling
* [Redux](https://github.com/reactjs/redux) Predictable state container for JavaScript apps 
* [React Router Redux](https://github.com/reactjs/react-router-redux) Ruthlessly simple bindings to keep react-router and redux in sync
* [styled-components](https://github.com/styled-components/styled-components) Keeping styles and components in one place
* [font-awesome-webpack](https://github.com/gowravshekar/font-awesome-webpack) to customize FontAwesome

**Backend**

* [Django](https://www.djangoproject.com/)
* [Django REST framework](http://www.django-rest-framework.org/) Django REST framework is a powerful and flexible toolkit for building Web APIs
* [MongoEngine](https://github.com/MongoEngine/mongoengine) Python ODM for MongoDB
* [Celery](http://docs.celeryproject.org/en/latest/) Distributed tasks queue


## Architecture

This app has a bit complicated architecture due to the nature of other systems it has to communicate.

* MongoDB - a NoSql database where we keep application data in json like documents. Here we also store actions for Unified.
* Oracle - we only read failed workflows names which are stored here by Unified. _It would be nice if Unified provided api or at least stored it in MongoDB._
* RequestManager - rest api used for fetching related workflows PrepID name. _To access this api you need grid certificate._
* WmStats - rest api from which we get all the info about workflow and errors. _To access this api you need grid certificate._


## Installing on a new machine (prod, dev)

Production/development setup uses nginx as reverse proxy and Gunicorn as an application server.
Below are the steps needed to setup environment on RHEL from scratch. Instructions are based on this article [How To Set Up Django with Postgres, Nginx, and Gunicorn on CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-centos-7#create-a-gunicorn-systemd-service-file) 

### Setting up environment

Use these instructions to setup a new production environment from scratch. By following these instructions you will create a dedicated user _wtc-console_ for running this application with Gunicorn, update proxy config for Nginx and setup firewall to allow traffic on port 80.

#### Prerequisites:
- Python >=2.7

#### Install Node and NPM

If you are using CERN managed machine then ask administrator to install latest Node version.
If you are managing this machine, then follow this guide for [RHEL](https://tecadmin.net/install-latest-nodejs-and-npm-on-centos/)

#### Install Oracle Instant Client

* Go to [Oracle client site](https://www.oracle.com/technetwork/database/database-technologies/instant-client/overview/index.html) and download Oracle Instant Client 12.2 Basic. Note: you will need to have Oracle account and download it to your machine.

* Upload it to the server in your preferred way
* Run `sudo yum localinstall oracle-instantclient* --nogpgcheck`

#### Install RabbitMQ

Add RabbitMQ repo according to [RabbitMQ installation guide](https://www.rabbitmq.com/install-rpm.html#bintray).
Then run these commands:

* `sudo yum install rabbitmq-server`
* `sudo chkconfig rabbitmq-server on`
* `sudo /sbin/service rabbitmq-server start`

#### Create user and login with it

* `sudo useradd wtc-console`
* `sudo su - wtc-console`

#### Get the sources

Clone this project to wtc-console users home directory.

* `git clone https://github.com/CMSCompOps/wtc-console.git`
* `cd wtc-console/`

#### Setup oracle client

Open wtc-console users .bashrc file: 

`vim ~/.bashrc`

Add these lines to it:

```
export ORACLE_HOME=/usr/lib/oracle/12.2/client64
export LD_LIBRARY_PATH=$ORACLE_HOME/lib
export PATH=$PATH:$ORACLE_HOME/bin
```

And apply these changes:

`. ~/.bashrc `

#### Create virtual python environment

* `pip install --upgrade pip`
* `pip install virtualenv`
* `virtualenv wtc-console-env`

#### Install and configure nginx

Log out of wtc-console users session and with your user install nginx and dependencies

* `sudo yum install epel-release`
* `sudo yum install nginx`

Add following lines to _/etc/nginx/nginx.conf_ as a first _server_ entry in _http_ section and change **domain_name** to the actual domain name probably in format of _node_name.cern.ch_
```
server {
    listen 80;
    server_name domain_name;
    location = /favicon.ico { access_log off; log_not_found off; }
    location / {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://0.0.0.0:8000;
    }
}
```

Test if configuration is valid

* `sudo nginx -t`

Start nginx and set it to run on startup

On RHEL and CentOS:
* `sudo systemctl start nginx`
* `sudo systemctl enable nginx`

On Scientific Linux CERN:
* `sudo service nginx start`
* `sudo chkconfig nginx on`

##### For RHEL, Fedora, CentOS

If when opening _domain.cern.ch_ you see this error in _/var/log/nginx/error.log_:

```
*2 connect() to 127.0.0.1:8000 failed (13: Permission denied) while connecting to upstream, client: some_ip, server: some_domain, request: "GET / HTTP/1.1", upstream: "http://127.0.0.1:8000/", host: "some_domain"
```

Then use this command to solve it:
* `sudo setsebool -P httpd_can_network_connect 1`

It turns on httpd connections and -P makes it persistent.


#### Give Nginx group rights to the project directory

* `sudo chown -R wtc-console:nginx /home/wtc-console/wtc-console`
* `sudo chmod 770 /home/wtc-console/wtc-console`

#### Firewall config

Ask system administrators to include port 80 to puppet config. If puppet is not used, then you can configure firewall yourself to bypass traffic on this port with these commands:

* `sudo iptables -I INPUT 1 -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT`
* `sudo iptables -I OUTPUT 1 -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT`
* `sudo service iptables save`
* `sudo service iptables restart`

You can see current config with `sudo iptables --line -vnL` or `sudo less /etc/sysconfig/iptables`

#### Update settings

##### For development node

Copy _src/djangoreactredux/settings/local_template.py_ setting file to _src/djangoreactredux/settings/local.py_ and update Oracle db credentials.

##### For production node

Create prod.py in `src/djangoreactredux/settings/` directory by using _prod_template.py_ settings template file and update the oracle and mongo db fields with prod values.

* `cp src/djangoreactredux/settings/prod_template.py src/djangoreactredux/settings/prod.py`
* `vim src/djangoreactredux/settings/prod.py`
 
Create certificates for this machine and copy them to _cert/_ directory.

#### Next steps

Proceed to [Development on dev machine](#development-on-dev-machine) or [Production deployment](#production-deployment) steps depending on the machine purpose.


### Development on remote machine

Development on remote node requires to run three sessions (terminals). First one will have frontent watch running, second will have backend running. And third one is for developent with editor of your choise.

##### For all terminals
Become wtc-console user:
* `sudo su - wtc-console`

Go to project dir
* `cd wtc-console`

##### In terminal 1
Start frontend resources watching:
* `npm install && npm run dev`

##### In terminal 2
Start Django backend and Celery workers:
* `./bin/start_dev.sh`

##### In terminal 3
Edit sources with an editor of you choise.


### Production deployment


Become wtc-console user:

* `sudo su - wtc-console`

Go to project dir

* `cd wtc-console`

Deployment is done with one bash command. It will:
* shutdown celery workers
* shutdown current application if running
* pull latest changes from repository master branch
* install missing dependencies
* build frontend app
* start the application
* start celery workers

`./bin/deploy_prod.sh`


#### Stopping server

If for some reason application should be stoppet then use this script:

`./src/bin/stop_prod.sh`

It will stop Gunicorn and Celery tasks

#### Maintenance

Logs are in /home/wtc-console/wtc-console/logs

## Development guidelines

When developing a new feature create your own branch and push your changes at least daily.

Do not push directly to master. Create pull requests and assign someone to approve it. Go through your pull request your self, it helps to see if there is unwanted or commented-out code.


## Adding new dependencies

While working on project you might encounter situations where you want to add functionality from third parties. This is done by adding dependecies to external libraries.

### Frontend

Intall dependency with yarn

* `yarn add dependency-name`

### Backend

Install dependency with pypi

* `pip install dependency-name`

