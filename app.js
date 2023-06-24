//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const items = ["Finish Lesson 300 - Udemy Course","Push the project to GitHub", "Reply to Slack Messages"];
const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

const day = date.getDate();

  res.render("list", {listTitle: day, newItem: items});

});


app.post("/", function(req, res){

 const item = req.body.newItem;

 if (req.body.list === "Work"){
  workItems.push(item);
  res.redirect("/work");
 } else {
  items.push(item);
  res.redirect("/");
 }

});

app.get("/work", function(req, res){
res.render("list", {listTitle: "Work List", newItem: workItems});
});


app.listen(3000, function () {
  console.log("Running on localhost 3000");
})
