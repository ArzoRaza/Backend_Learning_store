const express = require('express');
const app = express();
const userModel = require("./models/user")
const postModel = require("./models/posts")

app.get("/", function(req, res){
    res.send("helloArzo");
})

app.get("/create", async function(req, res){
    let user = await userModel.create({
        username: "akbar", 
        age: 22, 
        email:"akbar@gmail.com"
    });
    res.send(user)
})
app.get("/post/create", async function(req, res){
    let post = await postModel.create({
        postdata: "You will only fail when you not complete your tasks",
        user: "665e096ebd932e2bacd3c488",
    })
    let user = await userModel.findOne({_id: "665e096ebd932e2bacd3c488"});
    user.posts.push(post._id);
    user.save();
    res.send({post, user});

    res.send(post);
})

app.listen(3000);