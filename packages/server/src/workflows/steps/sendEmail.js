const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.definition = {
  description: "Send an email",
  tagline: "Send email to {{inputs.to}}",
  icon: "ri-mail-open-fill",
  name: "Send Email",
  type: "ACTION",
  stepId: "SEND_EMAIL",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        to: {
          type: "string",
          title: "Send To",
        },
        from: {
          type: "string",
          title: "Send From",
        },
        subject: {
          type: "string",
          title: "Email Subject",
        },
        contents: {
          type: "string",
          title: "Email Contents",
        },
      },
      required: ["to", "from", "subject", "contents"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether the email was sent",
        },
        response: {
          type: "object",
          description: "A response from the email client, this may be an error",
        },
      },
      required: ["success"],
    },
  },
}

module.exports.run = async function({ inputs }) {
  const msg = {
    to: inputs.to,
    from: inputs.from,
    subject: inputs.subject,
    text: inputs.text,
  }

  try {
    let response = await sgMail.send(msg)
    return {
      success: true,
      response,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      response: err,
    }
  }
}
