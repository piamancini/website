'use strict'
var express = require('express');
var url = require('url');
var fs = require('fs');
var config = require('./config');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var googleSpreadsheets = require('google-spreadsheet');
var path           = require('path')
  , templatesDir   = path.resolve(__dirname + '/email')
  , emailTemplates = require('email-templates')
var app = express();

app.use(bodyParser.json());
app.use( bodyParser.urlencoded( { extended: true } ) );


var transporter = nodemailer.createTransport({
  service: 'mailgun',
  auth: {
    user: config.mailer.auth.user,
    pass: config.mailer.auth.pass
  }
});


app.post('/', function (req, res){

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'website@opencollective.com', // sender address
    to: 'ops@opencollective.com' // list of receivers
  };

  if (!req.body.country) {
    mailOptions.subject = 'Invitation request - ' + req.body.source;
    mailOptions.text = req.body.email + ' Requested to join the beta for OpenCollective';
    mailOptions.html = '<a mailto:'+req.body.email+'/>'+req.body.email+'</a> Has requested to join OpenCollective';
  }
  else {
    var candidate = req.body.candidate;
    var collective = req.body.collective;
    var size = req.body.size;
    var country = req.body.country;
    var budget = req.body.budget;
    var textarea = req.body.textarea;
    var name = req.body.name;

    mailOptions.subject = 'Follow up for candidate ' + candidate + ' - ' + req.body.source;
    mailOptions.text = 'Follow up for Candidate ' + candidate;
    mailOptions.html = 'Candidate: <a mailto:' + candidate + '/>' + candidate + '</a><br/> Collective: ' + collective + '<br/> Country: ' + country + '<br/> Expected Profit: ' + budget + '<br/> Goals: ' + textarea +'<br/> Name: ' + name;
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return res.sendStatus(400, 'Not happening.')
      }
      console.log('ok')
      res.sendStatus(200, 'Yay! Here goes!')
  })

  var email = req.body.email;

  console.log(mailOptions.html)
  console.log('email ' + req.body.email)

  emailTemplates(templatesDir, function(err, template) {

    if (err) {
      console.log(err);
    } else {

      // Send a single email
      template('action', function(err, html, text) {
        if (err) {
          console.log(err);
        } else {
          transporter.sendMail({
            from: 'ops@opencollective.com',
            to: email,
            subject: 'SAMPLEHERE',
            html: html,
            // generateTextFromHTML: true,
            text: text
          }, function(err, responseStatus) {
            if (err) {
              console.log(err);
            } else {
              console.log(responseStatus.message);
            }
          });
        }
      });

    } //else
  });
});

app.use('/public', express.static(__dirname + '/public'))

app.get('*', function (req, res) {
  var parsedUrl = url.parse(req.url);
  var page = parsedUrl.pathname.substr(1) || 'index';
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
