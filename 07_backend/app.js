const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("hello arzo");
}) 

app.listen(1);