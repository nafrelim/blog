## Launching the application

The application is launched using the address [http://localhost:8080/](http://localhost:8080/) (after local deployment) or using the address [https://nafrelim-blog.herokuapp.com](https://nafrelim-blog.herokuapp.com/). If the application was running on a different port, this port must be changed in the invocation address.

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
