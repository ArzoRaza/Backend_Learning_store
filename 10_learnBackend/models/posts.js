const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    postdata: String, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//Here it's line exports this file with the help of module.exports  
module.exports = mongoose.model('posts', postSchema);