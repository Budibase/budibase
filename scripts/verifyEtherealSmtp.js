const nodemailer = require("nodemailer")

const options = {
  port: 587,
  host: "smtp.ethereal.email",
  secure: false,
  auth: {
    user: "irma.stehr61@ethereal.email",
    pass: "qrpvnHWBqPEKPfFytS",
  },
}

const transporter = nodemailer.createTransport(options)
transporter.verify(function (error) {
  if (error) {
    console.log(error)
  } else {
    console.log("Ethereal server is ready to take our messages")
  }
})

const message = {
  from: "from@example.com",
  to: "to@example.com",
  subject: "Did this email arrive?",
  html: "Hello World!",
}

transporter.sendMail(message).then(response => {
  console.log("Test email URL: " + nodemailer.getTestMessageUrl(response))
})
