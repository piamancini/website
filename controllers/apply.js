const emaillib = require('../lib/email');

module.exports = (req, res) => {

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
      emaillib.sendResponseEmail(email);
    }
  }

  // send email to ops@opencollective.com
  emaillib.sendMail(mailOptions, function(error) {
    return res.send("registration sent");
  });


};