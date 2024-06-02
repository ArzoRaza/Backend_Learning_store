// const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');


// app.use(cookieParser());

// app.get("/", (req, res)  => {
//     res.cookie("name", "jungle");
//     res.send("ok");
// });

// app.get("/read", (req, res) => {
//     console.log(req.cookies);
//     res.send("reload done");
// })

app.get("/", function(req, res) {
    bcrypt.compare("password", "$2b$10$uyokqhmt73S7LJKOyPmn4un9KIPA/Iyhx7oH5uPBtLc6IPSwI8p1.", function(err, result){
        console.log(result);
    })
})

app.listen(3000);