const express = require('express')
const Post = require('../models/post')
const router = express.Router()

//k intersting image for jpeg and png, images for gif
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

router.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: 'desc'})
    res.render('posts/index', {posts: posts})
    //res.send("post root page")
})
router.get('/new', (req, res) => {
    //res.send("post new page")
    // render new page with an empty post
    renderNewPage(res, new Post())
})

//router.get('/edit/:id', async (req, res) => {
router.get('/edit/:slug', async (req, res) => {
    //const post = await Post.findById(req.params.id)
    const post = await Post.findOne({ slug: req.params.slug})
    //console.log("routes, edit, slug: " + post.slug)
    //console.log("routes, edit, description: " + post.description)
    //console.log("routes, edit, date: " + post.publishDate)
    res.render('posts/edit', { post: post })  
    //res.render('/edit/:slug', { post: post })  
})

router.get('/:slug', async (req, res) => {
    const post = await Post.findOne({slug: req.params.slug })
    if (post == null) res.redirect('/')
    res.render('posts/show', {post: post})
})

router.post('/', async (req,res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),   
    })
    // saveImage(..) convert the picture into Buffer string and type
    if (req.body.picture == null) {console.log("picture is null")}
    saveImage(post, req.body.picture)
    // now you can save the post in try catch loop
    try {
        const newPost = await post.save()
        res.redirect(`posts/${newPost.id}`)
        //res.redirect(`post`)
    } catch(err) {
        // true => there is error 
        console.log("routes, post save catch err: " + err)
        renderNewPage(res, post, true)
    }
})

//k I should use :id here bc it doesn't display url
router.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/posts')
})

function saveImage(post, pictureEncoded) {
    if ( pictureEncoded == null) return
    const picture = JSON.parse(pictureEncoded)
    // => an obj with size, type, name,... and data
    if ( post != null && imageMimeTypes.includes(picture.type)) {
        post.postImage = new Buffer.from(picture.data, 'base64')
        // later we can use the buffer to convert correct type of image
        post.postImageType = picture.type
    }
}

// used in post('/) catch statement with a post obj
// used in get('/new') with an empty post obj
function renderNewPage(res, post, hasError= false) {
   const params = { post: post }
   if (hasError) params.errorMessage = 'Error Creating Post'
   if (post.postImage != null) {console.log("routes, postImage is not null ")}
   if (post.postImageType != null) {console.log("routes, postImageType is not null ")}
   res.render('posts/new', params)
}

module.exports = router