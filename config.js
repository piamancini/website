module.exports = {
  mailer: {
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
    defaultFromAddress: 'OpenCollective Bot <hello@opencollective.org>'
    }
}