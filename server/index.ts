import * as express from "express";
import * as exphbs from "express-handlebars";

let app = express();
app.set("view engine", "hbs");
app.set("views", "server/views");
app.engine("hbs", exphbs({
    defaultLayout: "default",
    extname: "hbs",
}));

app.use(express.static("dist/"));

app.get("/", (req, res) => {
    res.render("index", {title: "Jake's Travel Website"});
});

app.get("/gallery", (req, res) => {
    res.render("gallery", {title: "Gallery"});
});

app.get("/todo", (req, res) => {
    res.render("todo", {title: "My To-Do List", otherdiv: "other-page-background"});
});

app.get("/about", (req, res) =>{
    res.render("about", {title: "About Me"})
});

app.listen(1234, () => console.log("listening on 1234"))
    .on("error", (e) => console.error(e));