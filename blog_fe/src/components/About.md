# 1. Introduction - the purpose of the project

The purpose of this task is to prepare an E2E experience of a Blog.

The application is called **cvt-blog** and includes three main components:

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
* swagger

### 2.3 Database

The data is stored on a database server built on the basis of PostgreSQL version 14.1, but with high probability, blog_be will run on older versions without major problems.
Detailed database configuration data can be found in the **Deployment** chapter of this document.
