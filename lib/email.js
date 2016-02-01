const config = require('config');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'mailgun',
  auth: {
    user: config.mailgun.user,
    pass: config.mailgun.password
  }
});

module.exports = {
  sendMail: transporter.sendMail,
  
  sendResponseEmail: function(email) {
    // We send the response email to the user
    var responseEmail = {
      from: 'OpenCollective<info@opencollective.com>',
      to: email
    }

    responseEmail.subject = 'Thank you for your submission';
    responseEmail.text = 'Thank you for reaching out to Open Collective! \n\nWe’ll be in touch shortly to talk about what amazing projects you have in mind.\n\nIn the meantime join our community through our Slack channel: https://slack.opencollective.com/ and take a peek at our latest Open Collective https://opencollective.com/yeoman \n\nTalk to you soon!';
    responseEmail.html = 'Thank you for reaching out to Open Collective! <br /><br />We’ll be in touch shortly to talk about what amazing projects you have in mind.<br /><br/>In the meantime join our community through our <a href="https://slack.opencollective.com/">Slack channel</a> and take a peek at our latest <a href="https://opencollective.com/yeoman">Open Collective</a>.<br /><br />Talk to you soon!';

    transporter.sendMail(responseEmail);
  }
}