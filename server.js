"use strict";
const express = require("express");
const exphbar = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");

//create redis client
var redisClient = redis.createClient();
redisClient.on("connect", () => {
    console.log("redis Connected successfully")
})

//set port
const PORT = 4000;

//init app
const app = express();

//view engine
app.engine("handlebars", exphbar({ defaultLayout: 'main' }));
app.set("view engine", 'handlebars');

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//method override
app.use(methodOverride('_method'));

app.get('/', (req, res, next) => {
    res.render('searchusers');
});
app.post('/user/search', (req, res, next) => {
    let userId = req.body.userId;
    redisClient.hgetall(userId, (error, object) => {
        if (!object) {
            res.render("searchusers", { error: "user Not fount" });
        } else {
            object.id = userId;
            res.render('details', { user: object });
        }
    })
});
//add user
app.get("/user/add", (req, res, next) => {
    res.render("adduser");
});
//save user
app.post("/user/add", (req, res, next) => {
    let id = req.body.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;
    redisClient.hmset(id, [
        "first_name", first_name,
        "last_name", last_name,
        "email", email,
        "phone", phone
    ], (error, reply) => {
        if (error) {
            console.log(error);
        } else {
            console.log(reply);
        }
    })
    res.redirect('/');
})

app.listen(PORT, () => {
    console.log(`Server started http://localhost:${PORT} `);
});