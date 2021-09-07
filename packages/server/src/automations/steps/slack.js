const fetch = require("node-fetch")

exports.definition = {
  name: "Slack Message",
  tagline: "Send a message to Slack",
  description: "Send a message to Slack",
  icon: "ri-slack-line",
  stepId: "slack",
  type: "ACTION",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: "string",
          title: "Incoming Webhook URL",
        },
        text: {
          type: "string",
          title: "Message",
        },
      },
      required: ["url", "text"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: "number",
          description: "The HTTP status code of the request",
        },
        success: {
          type: "boolean",
          description: "Whether the message sent successfully",
        },
      },
    },
  },
}

exports.run = async function ({ inputs }) {
  let { url, text } = inputs
  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      text,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  return {
    httpStatus: response.status,
    success: response.status === 200,
  }
}
