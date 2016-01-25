'use strict'
var express = require('express');
var url = require('url');
var fs = require('fs');
var config = require('./config');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var googleSpreadsheets = require('google-spreadsheet');
var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', '/email')
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


var sendResponseEmail = function(email) {
  // We send the response email to the user
  var responseEmail = {
    from: 'OpenCollective<info@opencollective.com>',
    to: email
  }

  responseEmail.subject = 'Thank you for joining us!';
  responseEmail.text = 'Thank you for reaching out to Open Collective! \n\nWe’ll be in touch shortly to talk about what amazing projects you have in mind.\n\nIn the meantime join our community through our Slack channel: https://slack.opencollective.com/ and take a peek at our latest Open Collective https://opencollective.com/yeoman \n\nTalk to you soon!';
  responseEmail.html = 'Thank you for reaching out to Open Collective! <br /><br />We’ll be in touch shortly to talk about what amazing projects you have in mind.<br /><br/>In the meantime join our community through our <a href="https://slack.opencollective.com/">Slack channel</a> and take a peek at our latest <a href="https://opencollective.com/yeoman">Open Collective</a>.<br /><br />Talk to you soon!';

  transporter.sendMail(responseEmail);
}

app.post('/', function (req, res){

  var mailOptions = {
    from: 'website@opencollective.com', // sender address
    to: 'ops@opencollective.com' // list of receivers
  };

  var email = req.body.email;
  var source = req.body.source;

  // 1st step of registration
  if (!req.body.country) {
    
    mailOptions.subject = 'Invitation request - ' + source;
    mailOptions.text = email + ' Requested to join the beta for OpenCollective';
    mailOptions.html = '<a mailto:'+email+'/>'+email+'</a> Has requested to join OpenCollective';

    sendResponseEmail(email);

  }
  else {
  // 2nd step of registration
    var collective = req.body.collective;
    var size = req.body.size;
    var country = req.body.country;
    var budget = req.body.budget;
    var textarea = req.body.textarea;
    var name = req.body.name;

    mailOptions.subject = 'Follow up for candidate ' + email + ' - ' + req.body.source;
    mailOptions.text = 'Follow up for candidate ' + email;
    mailOptions.html = 'email: <a mailto:' + email + '/>' + email + '</a><br/> Collective: ' + collective + '<br/> Country: ' + country + '<br/> Expected Profit: ' + budget + '<br/> Goals: ' + textarea +'<br/>';
    if(name) {
      mailOptions.html += 'Name: ' + name;
      sendResponseEmail(email);
    }
  }

  // send email to ops@opencollective.com
  transporter.sendMail(mailOptions, function(error) {
    return res.send("registration sent");
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
