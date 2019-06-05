import * as express from "express";

import {DB, Rows, InsertResult} from "./db";

let router = express.Router();

// Helper function to find path of current page
let path = (req: express.Request): string =>{
    return `${req.baseUrl}${req.path}`;
}

router.get("/", (req, res) =>{
    res.render("admin/index", {
        layout: "admin"
    })
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