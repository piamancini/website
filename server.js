'use strict'
var express = require('express')
var nodemailer = require('nodemailer')
var bodyParser = require('body-parser')
var googleSpreadsheets = require('google-spreadsheet')
var app = express()

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/assets', express.static(__dirname + '/assets'));

// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'EMAILHERE',
        pass: 'PASSWORDHERE'
    }
});
 

// setup e-mail data with unicode symbols 
var mailOptions = {
    from: 'Sample Mail <hola@maruma.ru>', // sender address 
    to: 'Sample Mail <hola@maruma.ru>', // list of receivers 
    subject: 'Hello ✔', // Subject line 
    text: 'Hello world ✔', // plaintext body 
    html: '<b>Hello world ✔</b>' // html body 
};
 
// send mail with defined transport object 
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Life signals at http://%s:%s', host, port)
});