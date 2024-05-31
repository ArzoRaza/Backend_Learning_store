const express = require('express');
const app = express();

const userModel = require('./userModel');

app.get('/', (req, res) => {
    res.send("hey Arzo");
})

app.get('/create', async (req, res) => {
    let createduser = await userModel.create({
        name: "vivek",
        username: "vivek",
        email: "akbar@gmail.com"
    })
    res.send(createduser);
})

app.get('/read', async (req, res) => {
    let users = await userModel.find({ username: "ak240"});
    res.send(users);
})

app.get('/update', async(req, res) => {
    let updateduser = await userModel.findOneAndUpdate({username: "ak240"}, {name: "vivekRaj"}, {new: true});
    res.send(updateduser);
});

app.get('/delete', async(req, res) => {
    let users = await userModel.findOneAndDelete({name: "vivekRaj"});
    res.send(users);
});



app.listen(3000);