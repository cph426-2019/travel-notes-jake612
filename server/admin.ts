import * as express from "express";
import * as moment from "moment";
import * as bcrypt from "bcrypt";

import {DB, Rows, InsertResult} from "./db";
import * as cookieParser from "cookie-parser";

let router = express.Router();

// Helper function to find path of current page
let path = (req: express.Request): string =>{
    return `${req.baseUrl}${req.path}`;
}

let formatDate = (rows: Rows): Rows =>{
    rows.forEach((row)=>{
        row.publishAt = moment(row.publishAt).format("M/d/YYYY");
    });
    return rows;
}

// Cookie parser will read and write secure cookies that 
// are protected by our cookie secret.
router.use(cookieParser(process.env.COOKIE_SECRET));

router.get("/login", (req, res)=>{
    res.render("admin/login",{
        layout: "admin",
        messsage: req.query.message
    });
});



router.post("/login", async(req,res)=>{
    let isValid = await bcrypt.compare(req.body.password, process.env.ADMIN_PASSWORD_HASH);
    if (isValid){
        res.cookie("authenticated", "true", {
            signed: true // By using the signed option, our cookie is secure.
        });
        res.redirect(`${req.baseUrl}`); // Redirect to admin home page
    }else{
        res.redirect(`${req.baseUrl}/login?message=Password Incorrect`);
    }
});


router.get("/logout", (req, res)=>{
    res.clearCookie("authenticated");
    res.redirect(`${req.baseUrl}/login`);
});

// Middleware to authenticate the user
router.use((req, res, next)=>{
    if(req.signedCookies.authenticated){
        next();
    }else{
        return res.redirect(`${req.baseUrl}/login`);
    }
});

router.get("/", (req, res) =>{
    res.render("admin/index", {
        layout: "admin"
    });
});


router.get("/posts", async (req, res) =>{
    let [rows] = await DB.query<Rows>("SELECT * FROM posts ORDER BY publishAt DESC");
    rows = formatDate(rows);
    res.render("admin/posts/index",{
        posts: rows,
        layout: "admin"
    });
});


router.get("/posts/new", (req, res)=>{
    res.render("admin/posts/editor", {
        action: `${path(req)}/../`,
        layout: "admin",
        post: {
            title: "",
            body: "",
            publishAt:"",
            location:""
        },
    });  
});

router.post("/posts", async(req, res)=>{
    try {
        let sql = `INSERT INTO posts
                    (title, body, publishAt, location) VALUES
                    (:title, :body, :publishAt, :location)`;
        // object for the parameters
        let params = {
            title: req.body.title,
            body: req.body.body,
            publishAt: req.body.publishAt,
            location: req.body.location
        };

        if(req.body.body ===""||req.body.title === ""||req.body.publishAt===""||req.body.location===""){
            res.redirect(path(req)+"new?message=Invalid Field");
            return;
        }
        // Creating a new record in the DB is special because we
        // need to know the id that the DB assigned to our new record.
        let [result] =await DB.execute<InsertResult>(sql, params);
        result.insertId;
        res.redirect(`${path(req)}${result.insertId}?message=Saved!`);
    } catch(e) {
        console.error(e);
        res.redirect(`${path(req)}?message=Error Saving`);
    }
});

router.get("/posts/:id", async(req, res)=>{
    try{
        let [rows] = await DB.query<Rows>("SELECT * FROM posts where id=:id", {id: req.params.id});
        if(rows.length === 1){
            console.log(req.params.id);
            res.render("admin/posts/editor",{
                post: rows[0],
                layout: "admin",
                message: req.query.message,
                action: path(req)
            });
        }else{
            console.log("Rows length: " + rows.length);
            res.redirect(`${path(req)}/../`);
        }
    }catch(e){
        console.log(e);
        res.redirect(`${path(req)}/../`);
    }

});

router.post("/posts/:id", async(req, res)=>{
    try{
     // let query = "INSERT INTO posts (title, body, publishAt, location) VALUES :title, :body, :publishAt, :location";
        let query = `UPDATE posts     
                   SET title=:title, 
                       body=:body,
                       publishAt=:publishAt,
                       location=:location 
                   WHERE id=:id`;
        // object for the parameters
        let params = {
            id: req.params.id,
            title: req.body.title,
            body: req.body.body,
            publishAt: req.body.publishAt,
            location: req.body.location
        }
    
        let [result] =await DB.execute<InsertResult>(query, params);
        result.insertId;
        res.redirect(`${path(req)}${result.insertId}?message=Saved!`);
    }catch(e){
        console.log(e);
        res.redirect(`${path(req)}?message=Post Failure`);
    }
});

router.post("/posts/:id/delete", async(req, res)=>{
    let sql = "DELETE FROM posts WHERE id=:id";
    let params = {
        id: req.params.id
    };
    try{
        await DB.execute<Rows>(sql, params);
        res.redirect(`${path(req)}/../../`);
    }catch (e){
        console.error(e);
        res.redirect(`${path(req)}/../../`);
    }
});


// Listing all Todos
router.get("/todos", async (req, res)=>{
    let [rows] = await DB.query<Rows>("SELECT * FROM todos");
    
    res.render("admin/todos/index", {
        todos: rows,
        layout: "admin"
    });
});

// We're defining this route above /todos/:id to be sure
// it gets tested by the router logic first.

router.get("/todos/new", (req, res)=>{
    res.render("admin/todos/editor", {
        action: `${path(req)}/../`,
        layout: "admin",
        todo: {
            description: "",
            url: "",
        },
    });
});

// The route for creating a new todo is just "/todos" because the 
// HTTP spec says when you create a new resource, it should be 
// subordinate to the URL you posted your data to.
router.post("/todos", async (req, res)=>{
    try {
        let sql = `INSERT INTO todos
                    (description, url) VALUES
                    (:description, :url)`;
        // object for the parameters
        let params = {
            description: req.body.description,
            url: req.body.url
        };

        if(req.body.description ===""){
            res.redirect(path(req)+"new?message=Invalid Description");
            return;
        }
        // Creating a new record in the DB is special because we
        // need to know the id that the DB assigned to our new record.
        let [result] =await DB.execute<InsertResult>(sql, params);
        result.insertId;
        res.redirect(`${path(req)}${result.insertId}?message=Saved!`);
    } catch(e) {
        console.error(e);
        res.redirect(`${path(req)}?message=Error Saving`);
    }
});


// View the editor of an existing todo
router.get("/todos/:id", async(req, res)=>{
    let sql = "SELECT * FROM todos WHERE id=:id";
    let params = {id: req.params.id};
    try{
        let [rows] = await DB.query<Rows>(sql, params);
        if(rows.length === 1){
            res.render("admin/todos/editor", {
                todo: rows[0],
                action: path(req),
                layout: "admin",
                message: req.query.message
            });
        }else{
            res.redirect(`${path(req)}/../`);
        }
    }catch(e){
        console.error(e);
        res.redirect(`${path(req)}/../`);
    }
});

router.post("/todos/:id", async(req, res)=>{
    try {
        // You can use MySQL Workbench to generate this sql with specific values
        // replace specific values with placeholders prefixed by :
        let sql = `UPDATE todos     
                   SET description=:description, 
                       url=:url 
                   WHERE id=:id`;
        // object for the parameters
        let params = {
            id: req.params.id,
            description: req.body.description,
            url: req.body.url
        };
        await DB.execute<Rows>(sql, params);
        res.redirect(`${path(req)}?message=Saved!`);
    } catch(e) {
        console.error(e);
        res.redirect(`${path(req)}?message=Error Saving`);
    }
});

// Add delete support
router.post("/todos/:id/delete", async (req, res)=>{
    let sql = "DELETE FROM todos WHERE id=:id";
    let params = {
        id: req.params.id
    };
    try{
        await DB.execute<Rows>(sql, params);
        res.redirect(`${path(req)}/../../`);
    }catch (e){
        console.error(e);
        res.redirect(`${path(req)}/../../`);
    }
});

// Importing with just a name uses the default variable
export default router;