const { sendSmtpEmail } = require("../../utilities/workerRequests")

exports.definition = {
  description: "Send an email using SMTP",
  tagline: "Send SMTP email to {{inputs.to}}",
  icon: "Email",
  name: "Send Email (SMTP)",
  type: "ACTION",
  internal: true,
  stepId: "SEND_EMAIL_SMTP",
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
          title: "HTML Contents",
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

exports.run = async function ({ inputs }) {
  let { to, from, subject, contents } = inputs
  if (!contents) {
    contents = "<h1>No content</h1>"
  }
  try {
    let response = await sendSmtpEmail(to, from, subject, contents)
    return {
      success: true,
      response,
    }
  } catch (err) {
    return {
      success: false,
      response: err,
    }
  }
}
