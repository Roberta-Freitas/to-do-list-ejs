//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require ("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// create a schema
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: String
});

// create a model
const Item = mongoose.model('Item', itemSchema);

// Create instances of the Item model representing my todo items
const item1 = new Item({
  name: 'Welcome to your todolist!'
});

const item2 = new Item({
  name: 'Hit the + button to add a new item.'
});

const item3 = new Item({
  name: '<-- Hit this to delete an item.'
});

const defaultItems = [item1, item2, item3];

// create a list schema
const listSchema = new Schema({
  name: String,
  items: [itemSchema]
});

// create a list model
const List = mongoose.model('List', listSchema);


app.get("/", function(req, res) {
  Item.find({})
    .then(foundItems => {
      if (foundItems.length === 0) {
        return Item.insertMany(defaultItems);
      } else {
        return Promise.resolve(foundItems);
      }
    })
    .then(updatedItems => {
      if (Array.isArray(updatedItems)) {
        console.log("Successfully saved default items to DB");
      }
      res.render("list", { listTitle: "Today", newItem: updatedItems });
    })
    .catch(err => {
      console.log(err);
    });
});


app.get("/:customListName", async function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  try {
    const foundList = await List.findOne({ name: customListName }).exec();

    if (!foundList) {
      // Create a new list
      const list = new List({
        name: customListName,
        items: defaultItems
      });

      await list.save();
      res.redirect("/" + customListName);
    } else {
      // Show an existing list
      res.render("list", { listTitle: foundList.name, newItem: foundList.items }); // Use foundList.items instead of newItem
    }
  } catch (err) {
    console.log(err);
  }
});


app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then(foundList => {
        if (foundList) {
          foundList.items.push(item);
          return foundList.save();
        }
      })
      .then(() => {
        res.redirect("/" + listName);
      })
      .catch(err => {
        console.error(err);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).send("Internal Server Error");
      });
  }
});


app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    // Use Item.findByIdAndRemove to delete the item
    Item.findByIdAndRemove(checkedItemId)
      .then(() => {
        console.log("Successfully deleted the item.");
        res.redirect("/");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting the item.");
      });
  } else {
    // Use List.findOneAndUpdate to remove the item from the list's items array
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      { new: true } // This ensures you get the updated list document
    )
      .then((updatedList) => {
        if (updatedList) {
          console.log("Successfully deleted the item.");
          res.redirect("/" + listName);
        } else {
          console.log("List not found.");
          res.status(404).send("List not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting the item.");
      });
  }
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully");
});
