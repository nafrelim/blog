## Endpoints REST API

The application provides the main API using the address [http://localhost:8000/](http://localhost:8000/) (after local deployment).

> If the application was running on a different port, this port must be changed in the invocation address.

1. Endpoint **auth** allows you to log in (receive a JWT token), log out, create a user, refresh the token, obtain and, if necessary, update user data and change the password
2. Endpoint **api/post** provides a post list
3. Endpoint **api/view** provides a view list of posts (post ID and number of views)
4. Endpoint **api/comment** provides commentaries for posts
5. Endpoint **api/report** provides a blog report
6. Endpoint **api/parameters** provides additional information (list of authors) and parameters (number of posts per page)

## Url addresses supporting applications

1. Django application for managing the Django application - **admin/**
2. OpenAPI Swagger - **schema/swagger**
3. OpenAPI Redoc - **schema/redoc**
4. Debugger - **silk/**

## Login/Logout to API

Logging (via **/auth/login/** endpoint) enables functions to be performed. You can not do anything without logging in.
You can log in as **admin** (all functions available on all endpoints - POST, DEL, PATCH, PUT) or as **author1**, **author2**, **author3** or **author4** and then you can perform the following functions on the endpoint /api/post/:

* display all posts
* add one posts
* edit her/his posts
* delete her/his posts

The logged in author can also read (only!) information from the endpoint /api/view/.

Logout via **/auth/logut/** or **/auth/logut_all/** (logout all sessions of user)  

## Permisions
Generally, except for api/register/ and api/login/, endpoints are available only to logged in users.

Only the admin user can use the report (endpoint /api/report/) and change his password (endpoint /auth/change_password/).

The logged in user can only edit his user data (endpoint /auth/upadate_profile/).

## Services available on endpoints

### API/POST

Endpoint allows you to create, read, modify, delete posts. It does not allow operations on the number of views of the post.

#### /api/post/

* GET

#### /api/post/[id]/

* GET
* PUT (only for the author of the post and admin user)
* PATCH (only for the author of the post and admin user)
* DELETE (only for the author of the post and admin user)

### API/VIEW

Endpoint allows you to create reading and modifying the number of views of your posts

#### /api/view/

* GET

#### /api/view/[id]/

* GET
* PUT (only for admin user)
* PATCH (only for admin user)

### API/COMMENT

Endpoint allows you to create reading and modifying the number of views of your posts

#### /api/comment/

* GET

#### /api/comment/[id]/

* POST
* GET
* DELETE (only for admin user and author of the post)

#### /api/post_comment/[id]/
A comment list for the post.

* GET

### API/REPORT/

Endpoint allows you to create, read, modify, delete posts. It does not allow operations on the number of views of the post.

#### /api/report/

* GET (only for admin user)

### API/PARAMETERS/

Parameters needed for the blog_fe application.

#### /api/parameters/

* GET

### AUTH/

Endpoint provides services for logging in, logging out, JWT token handling, user service (creating, changing, obtaining information) 

#### /auth/register/

* POST (for everyone - the opportunity to register on the blog)

#### /auth/login/

* POST (only for registered user)

#### /auth/logout/

* POST

#### /auth/logout_all/
Logging out the user from all sessions.

* POST

#### /auth/refresh/
Token refresh.

* POST

#### /auth/update_profil/
User data update.

* POST (only for the logged in user and only for his profile)

#### /auth/change_password/
User password update.

* POST (only for the logged in user and only for his profile)

