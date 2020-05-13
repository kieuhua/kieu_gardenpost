const mongoose = require('mongoose')
const slugify = require('slugify')

const postSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String },
    publishDate: { type: Date, required: true},
    createdAt: { type: Date, default: Date.now },
    postImage: { type: Buffer, required: true},
    postImageType: { type: String, required: true},
    slug: { type: String, required: true, unique: true}
})

// postImagePath is virtual property, it converts the postImage(Buffer) into actual image file
// according to the specification type, charset,
// need to use function() not => to able to access this obj
postSchema.virtual('pictureImagePath').get( function() {
    //console.log("models,post, virtual, type:" + this.postImageType )
    if (this.postImage != null && this.postImageType != null) {
        return `data:${this.postImageType};charset=utf-8;base64,${this.postImage.toString('base64')}`
    }
})

// add slug middleware in postSchema
postSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true})
    }
    next()
})

module.exports = mongoose.model('Post', postSchema)