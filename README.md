# Contents

1. Introduction - the purpose of the project
2. Technologies used
3. Local deployment
4. Functional and technical deficiencies

# 1. Introduction - the purpose of the project

The purpose of this task is to prepare an E2E experience of a Blog.

The application is called **blog** and includes three main components:

1. Frontend application - **blog_fe**
2. Backend application - **blog_be**
3. Database

> It was assumed that blog_be and blog_fe applications can be developed independently, made available in different environments, and therefore they are divided.

### Frontend app - blog_fe

The main purpose of the application is to enable viewing of the posts contained in the database. A more detailed description of the application functions can be found in the README document in the blog_fe folder.

### Backend app - blog_be

The main purpose of the application is to expose data from the database in the form of the REST API interface and enable all operations, such as listing posts, downloading a single post, creating a post, editing it and deleting it. A more detailed description of the application functions can be found in the README document in the blog_be folder.

# 2. Technologies used

### 2.1 blog_fe app

The application was created based on the JavaScript language and the following additional modules:

* NodeJS with NPM
* React
* MUI5

### 2.2 blog_be app

The application is based on the Python language and the following additional modules and frameworks:

* python 3
* django framework
* django rest framework
* psycopg2-binary
* spectacular + swagger - OpenAPI documentation
* dj-rest-auth - authorization
* faker - generating data for tests and filling the database with sample records

### 2.3 Database

The data is stored on a database server built on the basis of PostgreSQL version 14.1, but with high probability, blog_be will run on older versions without major problems.
Detailed database configuration data can be found in the **Deployment** chapter of this document.

# 3. Local deployment

### 3.1 Common

In order to run cvt-blog locally, you need to have at least the following skills:

1. basic skills of managing a PostgreSQL database (installing a database, running psql, setting up a database, importing data from a backup file)
2. basic skills in the field of Python (installing Python, creating a virtual environment, installing modules using the pip application and running the script)
3. basic skills in the field of NodeJS applications (installing NodeJS and NPM, installing modules using the npm application and running the script)
4. ability to use the GIT tool

> The next steps and examples are based on the Windows environment.

### 3.2 Database

#### Starting the PostgreSQL server and creating the database.

1. Unless it is installed, you should install the  server [PostgreSQL](https://https://www.postgresql.org/download/) locally
2. Log in to the database server through the application manages the server **psql**
3. Create a database with any name

Remember all your login details in order to use them later to configure the blog_be application:

* server - default is **localhost**
* database - name provided when creating the database
* port - **5432** by default
* username - given when setting up the server, default **postgres**
* password - given when setting up the server, default **postgres**

### 3.3 Preparation of the project's repository

#### Create a project folder

The project repository can be located anywhere in the working folders.

#### Download the project's repository

The project's repository is on the GitBub platform at [https://github.com/nafrelim/cvt-blog](https://github.com/nafrelim/cvt-blog).
In order to download the application locally download it locally to the project folder in which it is located (git clone). Two subfolders should appear in the project folder: **blog_be** and **blog_fe**, filled with source code.

### 3.4 Installing and starting the **blog_be** application

Follow the steps below one by one to install blog_be apolication.

#### Install the Python environment

* [ ]  if not installed, install [Python](https://www.python.org/downloads/) language environment

#### Create a virtual environment for the blog_be application

* [ ]  go to the project folder
* [ ]  then in the blog_be folder create a virtual environment with the command `python -m venv venv`
* [ ]  aktywu środowisko wirtualne - w terminalu uruchom komende `.\venv\script\activate`

#### Install all needed Python modules

* [ ]  in the blog_be folder, execute the command `pip install -r requirements.txt`

#### Set the parameters of the database connection

* [ ]  modify the local_settings.py file in the blog_be folder in order to enter the database connection data:

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'HOST':  'localhost',
        'PORT':  5432,
        'NAME':  'database_name',
        'USER':  'postgres',
        'PASSWORD':  'postgres',
    }
}
```

Fill in the relevant fields in this file with the data that you saved when creating the database.

#### Create data structures in the database

* [ ]  create data structures - from the blog_be folder, run the `python manage.py migrate` command in the terminal

#### Create a superuser in the database

* [ ]  from the blog_be folder, run `python manage.py createsuperuser` in the terminal and create a user named **admin**
* [ ]  run the django **admin application** at [http://localhost:8000/admin](http://localhost:8000/admin), log in, enter sample data into the Posts table
* [ ]  by running the **Swagger** application at [http://localhost:8000/swagger](http://localhost:8000/swagger) you can check whether the entered data is visible through the REST API interface

#### Entering test data into the database

Calling the following procedure is optional and results in introducing 30 posts with sample content to the database and creating an additional test **admin** account (password: !234567890), if the superuser account has been given a different name.

* [ ]  from the blog_be folder, run in the terminal  command `python manage.py populateblog <posts>` , where <posts> is the number of posts generated
* [ ]  They are created:

* admin user with password !234567890
* users author1 and author2 with password !234567890
* a certain number of posts, half for author1 and half for author2

#### Run the application

From the blog_be folder, run the  `python manage.py runserver 8000` command in the terminal - the application will be available at [http://localhost:8000](http://localhost:8000).

> Warning! If you run the application on a different port, you should change (specify this port) in the **\blog_fe\src\blog_be.js** file

#### Entering data into the database by Django admin app

You can access the data to the database through:

* application use **admin**
* use of REST API endpoints, for example using the Swagger application
* or via the blog_fe application

### 3.4  REST API tests

* [ ]  to run REST API tests, run `pytest` command in the terminal in the **blog_be** folder

### 3.5 Installing and starting the **blog_fe** application

Follow the steps below one by one to install blog_fe application.

#### Install NodeJS

* [ ]  if not installed, install the [NodeJS](https://https://nodejs.org/en/download/) environment

#### Install all necessary modules

* [ ]  from the blog_fe folder, execute the command `npm install` in the terminal

#### Run the application

From the blog_fe folder, execute the command `npm start` in the terminal - the application will be available at [http://localhost:8080/#/post](http://localhost:8080/#/post).

> Warning! If you run the application on a different port, you should change (specify this port) in the **blog_fe\webpack.config.js** file

# 4. Online availability

1. Working applications are accessed through the Heroku website. This is described in the application README.

# The next stages of development

1. Expansion of post author management
