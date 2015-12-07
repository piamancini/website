module.exports = {
  mailer: {
    auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASSWORD
    },
    defaultFromAddress: 'OpenCollective Website <hello@opencollective.com>'
    }
}
