'use strict'
var express = require('express')
var nodemailer = require('node-mailer')
var bodyParser = require('body-parser')
var googleSpreadsheets = require('google-spreadsheet')
var app = express()

app.get('/', function (req, res) {
  res.send('PUCHI');
});

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Life signals at http://%s:%s', host, port)
});