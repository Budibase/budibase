const fetch = require("node-fetch")
const { getFetchResponse } = require("./utils")

exports.definition = {
  name: "Slack Message",
  tagline: "Send a message to Slack",
  description: "Send a message to Slack",
  icon: "ri-slack-line",
  stepId: "slack",
  type: "ACTION",
  internal: false,
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
        response: {
          type: "string",
          description: "The response from the Slack Webhook",
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

  const { status, message } = await getFetchResponse(response)
  return {
    httpStatus: status,
    response: message,
    success: status === 200,
  }
}
