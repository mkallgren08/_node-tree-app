const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
// const Pusher = require('pusher');

require('dotenv').config();
//console.log(process.env)
const PORT = process.env.PORT || 3001;
const app = express();

const pusher = require('./utils/pusher')
const channel = 'nodes';

// Configure body parser for AJAX requests
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json()); 
// Add routes 
app.use(routes);

// Serve up static assets (usually on heroku)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }
// Serve up static assets (usually on heroku)
app.use(express.static("client/build"));


// Set up promises with mongoose
mongoose.Promise = global.Promise;

// Declare Mongoose Connection Parameters
let mongoConnect = process.env.MONGODB_URI2;

// Connect to the Mongo DB
mongoose.connect(
  mongoConnect
);

// Test the Pusher connection
pusher.trigger('my-channel', 'my-event', {
  "message": "hello world"
});

const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log(`Mongoose connection to database successful.`); /*${mongoConnect}*/

  const nodeCollection = db.collection('nodes');
  const changeStream = nodeCollection.watch();

  changeStream.on('change', (change) => {
    //console.log(change);
      
    if(change.operationType === 'insert') {
      const child = change.fullDocument;
      console.log("Child Data: ")
      console.log(child)
      pusher.trigger(
        channel,
        'inserted', 
        {
          id: child._id,
          nodetype: child.nodetype,
          parent:child.parent,
          name:child.name,
          value:child.value
        }
      ); 
    } else if(change.operationType === 'delete') {
      pusher.trigger(
        channel,
        'deleted', 
        change.documentKey._id
      );
    } else if (change.operationType){
      console.log("Connection")
    }
  });
});

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
