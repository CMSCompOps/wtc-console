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

### Setup steps

Prerequisites:
* Python 3.7

Frontend builds, MongoDB, PostgreSql and RabbitMQ are run in docker containers to shorten setup time

* Install [Docker](https://www.docker.com/products/overview) and [Docker Compose](https://docs.docker.com/compose/install/).
* `$ docker-compose build`

Running oracle client in docker container is not solved yet. Because of this, client has to be installed locally.

* Install [Oracle client](https://www.oracle.com/downloads/index.html).
    * Setup tns config by putting tnsnames.ora in projects _oracle-admin_ folder.
* Copy _local_tamplate.py_ setting file to _local.py_ and fill it with certificates data and Oracle db credentials
* `$ ./bin/setup_dev.sh` - this will install Python requirements, setup PostgreSql database and populate it with initial user data

### Running and stopping

To start up development environment after it is setup you need to run these two commands in separate console windows/tabs in this order

* `$ docker-compose up`
* `$ ./bin/start_dev.sh`

To stop the development server:

* `$ ./bin/stop_dev.sh` - this will stop celery workers
* `$ docker-compose stop`

### Clean up

Stop Docker development server and remove containers, networks, volumes, and images created by up (to make a fresh start).

* `$ docker-compose down`

### Misc

You can access shell in a container

* `$ docker ps  # get the name from the list of running containers`
* `$ docker exec -i -t djangoreactreduxbase_rabbitmq /bin/bash`

The database can be accessed @localhost:5433

* `$ psql -h localhost -p 5433 -U djangoreactredux djangoreactredux_dev`


## Accessing Website

Go to [localhost:8000](http://localhost:8000)


## Django migrations

After changing models create database migrations with:

`$ python3 manage.py makemigrations workflows`

## Development

When developing a new feature create your own branch and push your changes at least daily.

Do not push directly to master. Create pull requests and assign someone to approve it. Go through your pull request your self, it helps to see if there is unwanted or commented-out code.

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
