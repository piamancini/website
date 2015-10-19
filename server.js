'use strict'
var express = require('express')
var nodemailer = require('nodemailer')
var bodyParser = require('body-parser')
var googleSpreadsheets = require('google-spreadsheet')
var app = express()

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(bodyParser.json())
app.use( bodyParser.urlencoded( { extended: true } ) );


var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.mailer.auth.user,
            pass: config.mailer.auth.pass
        }
    });

app.post('/', function (req, res){

    console.log(req.body)

      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: 'SENDEREMAIL', // sender address
        to: 'RECEIVEREMAIL', // list of receivers
        subject: 'Mailing List Candidate', // Subject line
        text: req.body.email + ' Puchi', // plaintext body
        html: '<a mailto:'+req.body.email+'/>'+req.body.email+'</a> Has requested to join the list on OpenCollective' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.sendStatus(400, 'Not happening.')
            return res.send('Nope. This is a failure.')
        }
        res.sendStatus(200, 'Yay! Here goes!')
    });

})

app.post('/send',function(req, res){
    var candidate = req.body.candidate
    var textarea = req.body.textarea
    var country = req.body.country
    var account = req.body.onoffswitch
    var select = req.body.select
    // setup e-mail data with unicode symbols

    var options = {
        from: 'SENDEREMAIL', // sender address
        to: 'RECEIVEREMAIL', // list of receivers
        subject: 'Follow up for Candidate ' + candidate, // Subject line
        text: 'Follow up for Candidate' + candidate, // plaintext body
        html: 'Candidate: <a mailto:' + candidate + '/>' + candidate + '</a><br/> Reason/Project: ' + textarea + '<br/> Country: ' + country + '<br/> Account: ' + account + '<br/> Expected Profit: ' + select // html body
    };

    console.log(options)

    // send mail with defined transport object
    transporter.sendMail(options, function(error, info){
        if(error){
            return res.sendStatus(400, 'Not happening.')
        }
        console.log('ok')
        res.sendStatus(200, 'Yay! Here goes!')
    });

});

app.use(require('morgan')())

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname + '/js'));

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Life signals at http://%s:%s', host, port)
});