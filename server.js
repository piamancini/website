'use strict'
var express = require('express')
var nodemailer = require('nodemailer')
var bodyParser = require('body-parser')
var googleSpreadsheets = require('google-spreadsheet')
var app = express()

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(bodyParser.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded

var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'maru@bxe.me',
            pass: 'maruxmaruxmaru'
        }
    });

app.post('/', function (req, res){
    console.log(req.body)

    var email = req.body.email || 'hola@maruma.ru'

    var mensaje  = req.body.mensaje || (req.body.email + ' Has requested to join the list on OpenCollective');
    var subject = req.body.asunto || 'Mailing List Candidate';
    if(req.body.mensaje){
        mensaje += "<br>" +"<br>" +"---" +"<br>" +"<br>" + email + " has requested to join the mailing list and be a candidate for OpenCollective"
    }
      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: 'maru@bxe.me', // sender address
        to: 'hola@maruma.ru', // list of receivers
        subject: 'Mailing List Candidate', // Subject line
        text: req.body.email + ' Puchi', // plaintext body
        html: '<a mailto:'+req.body.email+'/>'+req.body.email+'</a> Has requested to join the list on OpenCollective' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.status(400, 'Not happening.')
            res.send('Nope. This is a failure.')
        } else {
            res.status(200, 'Yay! Here goes!')
            res.redirect('/')
        }
    });

})


app.post('/followup', function (req, res){
    console.log(req.body)

    // setup e-mail data with unicode symbols
      var mailOptions = {
        from: 'maru@bxe.me', // sender address
        to: 'hola@maruma.ru', // list of receivers
        subject: 'Follow up', // Subject line
        text: req.body, // plaintext body
        html: req.body // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.status(400, 'Not happening.')
            res.send('Nope. This is a failure.')
        } else {
            res.status(200, 'Yay! Here goes!')
            res.redirect('/')
        }
    });
})

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname + '/js'));

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Life signals at http://%s:%s', host, port)
});