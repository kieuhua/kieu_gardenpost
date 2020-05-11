const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')

//const Post = require("./models/post")
const indexRouter = require('./routes/index')
const postRouter = require('./routes/posts')

const app = express()

mongoose.connect('mongodb://localhost/kieuposts', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

// I need to have this three lines for layouts to work
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ limit: '15mb', extended: false }))
app.use(express.urlencoded({extended: false}))  //k for encoding upload file ??
app.use(methodOverride('_method')) //k use _method param in view post form

// these should declare at the bottom, I forgot why??
app.use('/', indexRouter)
app.use('/posts', postRouter)

app.listen(4000)