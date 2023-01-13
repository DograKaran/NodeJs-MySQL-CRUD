const express = require("express");
const app = new express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");



dotenv.config();
//for templating engine

app.set("view engine", "ejs");
const connection = require("./config/db");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {

    res.redirect("/create.html");
});


app.get("/delete-data", (req, res) => {
    const deleteData = "delete from employee where id=?";
    connection.query(deleteData, [req.query.id], (err, rows) => {
        if (err) {
            res.send(err);
        } else {

            res.redirect("/data");
        }
    });
});


//update
app.post('/final-update', (req, res) => {

    console.log(req.body);

    const name = req.body.name;
    const email = req.body.email;
    const id = req.body.hidden_id;

    const updateQuery = "update employee set name=?,email=? where id=?";


    try {
        connection.query(updateQuery,
            [name, email, id],
            (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/data");
                }
            }
        );

    } catch (err) {
        console.log(err);

    }
});





app.get('/update-data', (req, res) => {
    connection.query("select * from employee where id= ?", [req.query.id], (err, eachRow) => {
        if (err) {
            console.log(err);
        }
        else {
            result = JSON.parse(JSON.stringify(eachRow[0]));
            console.log(result);

            res.render("edit.ejs", result);
        }
    })
})


app.get('/data', (req, res) => {
    connection.query("Select * from  employee", (err, rows) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("read.ejs", { rows });
        }
    });
});



app.post('/create', (req, res) => {

    console.log(req.body);

    const name = req.body.name;
    const email = req.body.email;


    try {
        connection.query(
            "INSERT into employee (name,email) values(?,?)",
            [name, email],
            (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/data");
                }
            }
        );

    } catch (err) {
        console.log(err);

    }
});

app.listen(process.env.PORT || 4000, (error) => {
    if (error) throw error;
    console.log(`server is running on port no ${process.env.PORT}`);
});
