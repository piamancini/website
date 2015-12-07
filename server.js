'use strict'
var express = require('express')
var fs = require('fs');
var config = require('./config')
var nodemailer = require('nodemailer')
var bodyParser = require('body-parser')
var googleSpreadsheets = require('google-spreadsheet')
var app = express()

app.use(bodyParser.json())
app.use( bodyParser.urlencoded( { extended: true } ) )


var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
            user: config.mailer.auth.user,
            pass: config.mailer.auth.pass
        }
    });


app.post('/', function (req, res){

      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: 'invite@opencollective.com', // sender address
        to: 'invite@opencollective.com', // list of receivers
        subject: 'Invitation request', // Subject line
        text: req.body.email + ' Requested to join the beta for OpenCollective', // plaintext body
        html: '<a mailto:'+req.body.email+'/>'+req.body.email+'</a> Has requested to join the list on OpenCollective' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.error("Error: ", error);
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
    var select = req.body.select
    // setup e-mail data with unicode symbols

    var options = {
        from: 'invite@opencollective.com', // sender address
        to: 'invite@opencollective.com', // list of receivers
        subject: 'Follow up for Candidate ' + candidate, // Subject line
        text: 'Follow up for Candidate ' + candidate, // plaintext body
        html: 'Candidate: <a mailto:' + candidate + '/>' + candidate + '</a><br/> Reason/Project: ' + textarea + '<br/> Country: ' + country + '<br/> Expected Profit: ' + select // html body
    };

    console.log(options)

    // send mail with defined transport object
    transporter.sendMail(options, function(error, info){
        if(error){
            return res.sendStatus(400, 'Not happening.')
        }
        console.log('ok')
        res.sendStatus(200, 'Yay! Here goes!')
    })

})

app.use('/styles', express.static(__dirname + '/public/styles'))
app.use('/assets', express.static(__dirname + '/public/assets'))
app.use('/js', express.static(__dirname + '/public/js'))

app.get('*', function (req, res) {
  var page = req.url.substr(1) || 'index';
  var filename = page+'.html';
  var filepath = __dirname+'/public/'+filename;
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  }
  else {
    res.sendStatus(404);
  }
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Life signals at http://%s:%s', host, port)
})
