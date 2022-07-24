## Endpoints REST API

The application provides the main API using the address [http://localhost:8000/#/api](http://localhost:8000/#/api) (after local deployment) or using the address [https://nafrelim-blog-be.herokuapp.com](https://nafrelim-blog-be.herokuapp.com/) (the application is made available in developer mode).

> If the application was running on a different port, this port must be changed in the invocation address.

1. Endpoint **api/post** provides a post list
2. Endpoint **api/view** provides a view list of posts (post ID and number of views)
3. Endpoint **api/account** provides a user list

> Address **/ admin** - the standard Django application for managing the Django application

## Endpoint support applications

Two endpoint support applications are provided:

1. Django Rest Framework - **/api**
2. Swagger - **/swagger**

## Login/Logout to API

Logging (via **/rest-auth/login/** endpoint) enables functions to be performed. You can not do anything without logging in.
You can log in as **admin** (all functions available on all endpoints - POST, DEL, PATCH, PUT) or as **author1** or **author2** and then you can perform the following functions on the endpoint /api/post/:

* display all posts
* add one posts
* edit your posts
* delete your posts

The logged in author can also read (only!) Information from the endpoint / api / view /.

Logout via **/rest-auth/logut/**.

## Permisions

## Services available on endpoints

### API/POST

Endpoint allows you to create, read, modify, delete posts. It does not allow operations on the number of views of the post.

#### /api/post/

* GET

#### /api/post/ [id] /

* GET
* PUT
* PATCH
* DELETE

### API/VIEW

Endpoint allows you to create reading and modifying the number of views of your posts.

#### /api/view/

* GET

#### /api/view/ [id] /

* GET
* PUT
* PATCH
