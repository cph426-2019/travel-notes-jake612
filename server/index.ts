import * as dotenv from "dotenv";
dotenv.config();

import {DB, Rows} from "./db";

import * as moment from "moment";

import * as express from "express";
import * as exphbs from "express-handlebars";

import admin from "./admin";

let app = express();
app.set("view engine", "hbs");
app.set("views", "server/views");
app.engine("hbs", exphbs({
    defaultLayout: "default",
    extname: "hbs",
}));

app.use(express.static("dist/"));
app.use(express.urlencoded({extended: true}));

app.use("/admin", admin);

app.get("/", async (req, res) => {
    let [rows] = await DB.query<Rows>("SELECT * FROM posts ORDER BY publishAt DESC");
    rows.forEach((row)=>{
        row.publishAt = moment(row.publishAt).format("M/d/YYYY");
    });
    res.render("index", {title: "Jake's Travel Website", posts: rows});
});

app.get("/gallery", (req, res) => {
    res.render("gallery", {title: "Gallery"});
});

app.get("/todo", (req, res) => {
    res.render("todo", {title: "My To-Do List", otherdiv: "other-page-background"});
});

app.get("/about", (req, res) =>{
    res.render("about", {title: "About Me"});
});

app.get("/map", (req, res)=>{
    res.render("map", {title: "My Map"});
});

app.get("/mapdata.json", async (req, res)=>{
    let [rows] = await DB.query<Rows>("SELECT * FROM locations");
    res.json(rows);
});

app.get("/posts.json", async (req, res)=>{
    let [rows] = await DB.query<Rows>("SELECT * FROM posts WHERE refCities IS NOT NULL ORDER BY publishAt DESC");
    res.json(rows);
});

app.get("/todos", async(req, res)=>{
    // Destructured assignment of rows without fields
    let [rows] = await DB.query<Rows>("Select * FROM todos");
    res.render("todos-demo", {todos:rows});

});

app.get("/todos/eat", async(req, res)=>{
    let sql ="INSERT INTO `todos` (`description`, `url`) VALUES (:description, :url)";
    await DB.execute(
        sql,
        {description: "EAT", url:"http://food.com"}
    );
    res.redirect("/todos");

} );

app.get("/todos/:id", async(req, res)=>{
    let [rows] = await DB.query<Rows>("SELECT * FROM todos WHERE id = :id", {id: req.params.id});
    res.json(rows);
})

app.get("/todos.json", async (req, res)=>{
    let [rows]= await DB.query<Rows>("SELECT * FROM todos");
    res.json(rows);
});

export let main = async()=>{
    app.listen(process.env.PORT, () => console.log(`listening on ${process.env.PORT}`))
    .on("error", (e) => console.error(e));
}

main();
