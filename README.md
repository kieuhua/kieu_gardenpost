# Kieu Garden Posts
This is Node.js with Express server, it uses MongoDB database with mongoose (ORM) to store users garden pictures. Users can upload their garden pictures for the public views.

## Features
- Upload garden pictures
- Create title, description, published
- Search by title, after and before published
- Edit and delete post
- Image-zoom for edit and show page
- Using unique title instead of id for post with slugify 
- method-override for using PUT and DELETE

### Screenshots ###
```/screenshots/root_page.png, posts_index.png, post_show.png, post_edit.png
```

### Used libraries
express, ejs, express-ejs-layouts, mongoose, filepond, image-zoom, method-overide, slugify

### Design
- Using filepond library: I able to convert an image into string to store on mongoDB with mongoose. I also have another web application server using multer library to store images on server publish file system, and store the pathname in mongoDB.
- Image-zoom library: allow users to examinate the detail of the garden picture, it is fascinating feature.
- Search feature, users can search on title, after and before pushlishDate, so they can narrow down what pictures they want to see
- Users should only edit and delete their own post
- I can create post id on url with unique name of title with slugify
- Using more parcific actions like PUT and DELETE with method-override
