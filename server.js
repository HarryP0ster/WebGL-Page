"use strict";

const port = 3000;

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'resources')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "resources/pages/main.html"));
  });

app.listen(port, function (error) {
    if (!error)
      console.log("Server is Listening at Port 3000!");
    else
      console.log("Error Occurred");
  });