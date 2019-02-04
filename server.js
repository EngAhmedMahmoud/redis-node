const express = require("express");
const exphbar = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

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

app.listen(PORT, () => {
    console.log(`Server started http://localhost:${port} `);
});