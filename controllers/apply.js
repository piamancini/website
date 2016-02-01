const emaillib = require('../lib/email');

module.exports = (req, res) => {

  var mailOptions = {
    from: 'website@opencollective.com', // sender address
    to: 'ops@opencollective.com' // list of receivers
  };

  var email = req.body.email;
  var source = req.body.source;
  
  if(!email || !email.match(/.+@.+\..+/))
    return res.sendStatus(400);
    
  mailOptions.subject = 'Invitation request - ' + source;
  mailOptions.text = email + ' Requested to join the beta for OpenCollective';
  mailOptions.html = '<a mailto:'+email+'/>'+email+'</a> Has requested to join OpenCollective';

  emaillib.sendResponseEmail(email);

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
  }

  console.log("Sending email", mailOptions);

  // send email to ops@opencollective.com
  emaillib.sendMail(mailOptions, function(error) {
    return res.send("registration sent");
  });


};