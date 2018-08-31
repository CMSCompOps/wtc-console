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
* [Django REST Knox](https://github.com/James1345/django-rest-knox) Token based authentication for API endpoints


## Setting up local environment

###Setup steps

Prerequisites:
* Python 3.7

Frontend builds, MongoDB, PostgreSql and RabbitMQ are run in docker containers to shorten setup time

* Install [Docker](https://www.docker.com/products/overview) and [Docker Compose](https://docs.docker.com/compose/install/).
* `$ docker-compose build`

Running oracle client in docker container is not solved yet. Because of this, client has to be installed locally.

* Install [Oracle client](https://www.oracle.com/downloads/index.html).
* Setup tns config (tnsnames.ora): `$ export TNS_ADMIN=/path-to-project/oracle-admin/`
* Copy _local_tamplate.py_ setting file to _local.py_ and fill it with certificates data and Oracle db credentials
* `$ pip3 install -r py-requirements/dev.txt` - to install Python requirements
* `$ python3 manage.py migrate --settings=djangoreactredux.settings.dev` - setup PostgreSql database
* `$ python3 manage.py loaddata fixtures.json --settings=djangoreactredux.settings.dev_docker` - populate with initial user data

To start up development environment after it is setup you need to run these two commands in separate console windows/tabs

* `$ ./bin/start_dev.sh`
* `$ docker-compose up`

To stop the development server:

* `$ ./bin/stop_dev.sh` - this will stop celery workers
* `$ docker-compose stop`

Stop Docker development server and remove containers, networks, volumes, and images created by up.

* `$ docker-compose down`

You can access shell in a container

* `$ docker ps  # get the name from the list of running containers`
* `$ docker exec -i -t djangoreactreduxbase_rabbitmq /bin/bash`

The database can be accessed @localhost:5433

* `$ psql -h localhost -p 5433 -U djangoreactredux djangoreactredux_dev`


## Accessing Website

Go to [localhost](http://localhost:8000)


## Django migrations

After changing models create database migrations with:
`$ python3 manage.py makemigrations workflows`


## Production

Requirements:
- Python 3.7
- PostgreSql
- Oracle client
- RabbitMQ

Create prod.py in `src/djangoreactredux/settings/` directory by using _prod_template.py_ settings template file and update the fields with prod values.


Production deployment and startup

`$ ./src/bin/deploy_prod.sh`

Note: prod deployment part is not finished yet.
