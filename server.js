'use strict'
var express = require('express');
var url = require('url');
var fs = require('fs');
var config = require('./config');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var googleSpreadsheets = require('google-spreadsheet');
var app = express();

app.use(bodyParser.json());
app.use( bodyParser.urlencoded( { extended: true } ) );


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
    from: 'website@opencollective.com', // sender address
    to: 'ops@opencollective.com' // list of receivers
  };

  if (!req.body.country) {
    mailOptions.subject = 'Invitation request - ' + req.body.source;
    mailOptions.text = req.body.email + ' Requested to join the beta for OpenCollective';
    mailOptions.html = '<a mailto:'+req.body.email+'/>'+req.body.email+'</a> Has requested to join the list on OpenCollective';
  }
  else {
    var candidate = req.body.candidate;
    var textarea = req.body.textarea;
    var country = req.body.country;
    var select = req.body.select;

    mailOptions.subject = 'Follow up for Candidate ' + candidate + ' - ' + req.body.source;
    mailOptions.text = 'Follow up for Candidate ' + candidate;
    mailOptions.html = 'Candidate: <a mailto:' + candidate + '/>' + candidate + '</a><br/> Reason/Project: ' + textarea + '<br/> Country: ' + country + '<br/> Expected Profit: ' + select;
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return res.sendStatus(400, 'Not happening.')
      }
      console.log('ok')
      res.sendStatus(200, 'Yay! Here goes!')
  })

})

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
