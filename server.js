"use strict";

const fs = require("fs");
const express = require('express');
const path = require('path');
const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, 'resources')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "resources/pages/main.html"))
  });

app.listen(port, function (error) {
    if (!error)
      console.log("Server is Listening at Port 3000!");
    else
      console.log("Error Occurred");
  });