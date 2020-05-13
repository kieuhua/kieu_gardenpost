const express = require('express')
const router = express.Router()
const Post = require('../models/post')

router.get('/', async (req, res) => {
    let posts
    try {
        console.log("routes, index, before Post find()")
        /*  lack of memory for sorting I can only have 4 pictures.\
        so, I may eliminate the sort, instead just list 10 the pictures.
        */
        //posts = await Post.find().sort({ createdAt: 'desc'}).limit(4).exec()
        posts = await Post.find().limit(10).exec()
    } catch(error) {
        console.log("routes, index, catch from  Post find(), error: " + error)
        posts = []
    } 
    res.render('index', {posts: posts})
    //res.send("root index page")  
})
module.exports = router