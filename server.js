"use strict";

const port = 3000;

const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'resources')));

app.get('/', function (req, res) {
    console.log(LoadJsonFile("resources\\assets\\Toy\\toy.json"));
    res.sendFile(path.join(__dirname, "resources/pages/main.html"));
  });

app.listen(port, function (error) {
    if (!error)
      console.log("Server is Listening at Port 3000!");
    else
      console.log("Error Occurred");
  });

  var LoadJsonFile = function(url) 
  {
    fs.readFile(url, 'utf-8', (err, output) =>
    {
      if (err)
      {
        console.log(err);
        return;
      }
      else
      {
        console.log(JSON.parse(output));
        return;
      }
    });
  }