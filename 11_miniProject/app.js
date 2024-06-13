const express = require('express');
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const path = require("path");
const upload = require("./config/multerconfig"); // Correct import path

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware for authentication
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data;
        next();
    } catch {
        return res.redirect("/login");
    }
}

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/profile/upload", (req, res) => {
    res.render("profileUpload");
});

app.post("/upload", isLoggedIn, upload.single('image'), async(req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    user.profilephoto = req.file.filename;
    await user.save()
    res.redirect("/profile")
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate("posts");
        res.render("profile", { user });
    } catch (error) {
        res.status(500).send("Error fetching profile data");
    }
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
    try {
        let post = await postModel.findOne({ _id: req.params.id }).populate("user");

        if (post.likes.indexOf(req.user.userid) === -1) {
            post.likes.push(req.user.userid);
        } else {
            post.likes.splice(post.likes.indexOf(req.user.userid), 1);
        }

        await post.save();
        res.redirect("/profile");
    } catch (error) {
        res.status(500).send("Error liking post");
    }
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
    try {
        let post = await postModel.findOne({ _id: req.params.id }).populate("user");
        res.render("edit", { post });
    } catch (error) {
        res.status(500).send("Error fetching post for edit");
    }
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
    try {
        await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content });
        res.redirect("/profile");
    } catch (error) {
        res.status(500).send("Error updating post");
    }
});

app.post("/post", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let { content } = req.body;

        let post = await postModel.create({
            user: user._id,
            content
        });

        user.posts.push(post._id);
        await user.save();
        res.redirect("/profile");
    } catch (error) {
        res.status(500).send("Error creating post");
    }
});

app.post("/register", async (req, res) => {
    try {
        let { email, password, username, name, age } = req.body;

        let existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).send("User already exists");

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        let user = await userModel.create({
            username,
            email,
            age,
            name,
            password: hash
        });

        let token = jwt.sign({ email: user.email, userid: user._id }, JWT_SECRET);
        res.cookie("token", token, { httpOnly: true });
        res.send("Account Registered");
    } catch (error) {
        res.status(500).send("Error registering user");
    }
});

app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) return res.status(400).send("Invalid email or password");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send("Invalid email or password");

        let token = jwt.sign({ email: user.email, userid: user._id }, JWT_SECRET);
        res.cookie("token", token, { httpOnly: true });
        res.status(200).redirect("/profile");
    } catch (error) {
        res.status(500).send("Error logging in");
    }
});

app.get("/logout", (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.redirect("/login");
});

app.listen(3000, () => {
    console.log("port is three thousand ");
});
