const express = require('express')
const Post = require('../models/post')
const router = express.Router()

//k intersting image for jpeg and png, images for gif
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

router.get('/', async (req, res) => {
    let query = Post.find()     // => all posts
    if (req.query.title != null && req.query.title != '') {
        // create query to filter the array of objs with this regex 
        query = query.regex('title', new RegExp(req.query.title, 'i' ))
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.lte('publishDate', req.query.publishedAfter)
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        console.log("routes, publishedBefore: " + req.query.publishedBefore)
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    //k it seems query is accumulated all search params
    // not sure how it works, but it works, title= "mo", before=2020-05-13
    // => http://localhost:4000/posts?title=mo&publishedBefore=2020-05-13
    try {
        const posts = await query.exec()
        res.render('posts/index', {
             posts: posts,
             searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    //const posts = await Post.find().sort({ createdAt: 'desc'})
    //res.render('posts/index', {posts: posts})
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

router.put('/:slug', async (req, res) => {
    //console.log("routes, put, slug1: ", req.params.slug)
    let post = await Post.findOne({slug: req.params.slug })
    //console.log("routes, put, slug2: ", post.slug )
    post.title = req.body.title
    post.description = req.body.description
    post.publishDate = req.body.publishDate
    try {
        post = await post.save()
        res.redirect(`/posts/${post.slug}`)
    } catch(err) {
        res.render(`posts/${post.slug}`)
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
   //if (post.postImage != null) {console.log("routes, postImage is not null ")}
   //if (post.postImageType != null) {console.log("routes, postImageType is not null ")}
   res.render('posts/new', params)
}

module.exports = router