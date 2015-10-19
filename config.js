module.exports = {
  rotation: process.env.ROTATION || '60m',
  mailer: {
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
    defaultFromAddress: 'Name LastName <sender@doma.in>'
    }
}