const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const from = 'pranavkevadiya@gmail.com'
sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from,
        to : email,
        text : `Welcone ${name} to this wonderful app`,
        subject : 'Welcome aboard!'
    });

}

sendCancellationEmail = (email, name) => {
    sgMail.send({
        from,
        to : email,
        text : `Hi ${name}, it's unfortunate for us that you chose to leave us`,
        subject : 'Feedback !'
    });

}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}