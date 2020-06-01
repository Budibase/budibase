const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = async function sendEmail(args) {
  const msg = {
    to: args.to,
    from: args.from,
    subject: args.subject,
    text: args.text,
  }

  try {
    await sgMail.send(msg)
    return {
      success: true,
      ...args,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      err,
    }
  }
}
