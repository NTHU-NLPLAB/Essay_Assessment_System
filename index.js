var app = require('express')();
var http = require('http').Server(app);
var express = require('express');




app.use(express.static('public'))



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});