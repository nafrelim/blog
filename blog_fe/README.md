## Running locally or with Docker

The [root README](../README.md) explains both run modes. For a local frontend,
run `npm ci` and `npm start` from `blog_fe/`. The development server listens on
port 8080 by default; set `PORT` to change it. The browser uses
`BLOG_API_URL` for backend requests (default: `http://localhost:8000`). For
example, `BLOG_API_URL=http://localhost:8001 npm start` points it to another
local backend port. In Docker Compose, `BLOG_API_URL` comes from
`blog_be/.env`; it must be a URL the browser can reach, not the Docker service
name. The frontend container serves on port 8080 internally and `FE_PORT`
selects its published host port.

## Launching the application

By default, the application is available at [http://localhost:8080/](http://localhost:8080/). If you change `FE_PORT` (Docker) or `PORT` (local), use that port in the browser address.

> For the add, edit and delete functions to work properly, you must log in to the bloge_be application (**see:** information in the [blog_be README file](../blog_be/README.md)).

At the top of the screen you can see a menu where we can always go back to the post list view (**POSTS**), or add a post (**ADD**).

## Adding a post

After entering screen, we can enter the title and content of the post. If any of the values is not provided, an appropriate message will be displayed. After preparing your post, send it by pressing the **SUBMIT** button.

## List of posts

The main view of the application is the post list containing the post titles.

Each post can be expanded by clicking on its title.

After expanding by clicking on the title of the post, you can see information about the beginning of the content of the post (200 characters), its author and date of creation. There is a button **SHOW ME**, which takes you to the screen with the entire content of the post.

## Display the entire content of the post

This screen schows entire content of the post and also shows how many times the post has been viewed (only views of the full post are counted).

On this screen, we can additionally edit the post (**EDIT** button) or delete it (**DELETE** button).

If you try to delete, a confirmation window will appear. In case of pressing the **DISAGREE** button, the user returns to the screen with the content of the post. If you press the **AGREE** button, the post is deleted and you go to the list of posts,

In case of pressing the **EDIT** button, we go to the post editing screen,

## Editing a post

After entering the post edit screen, information about the title and content of the post is displayed, which can be corrected. If any of the values is deleted, an appropriate message will be displayed. After preparing your post, send it by pressing the **SUBMIT** button.

> The login function does not work. The remaining menu item has been prepared for the next stage of application development.
>
