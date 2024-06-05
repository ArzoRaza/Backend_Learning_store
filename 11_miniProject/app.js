const express = require('express');
const app = express();
const userModel = require('./models/user');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: ture}));


app.get('/', (req, res) => {
    res.send("hello Arzo");
});

app.post('/create', (req, res) => {
    res.send("hello MD Akbar");
});

app.listen(3000);

