const fetch = require("node-fetch")

exports.definition = {
  name: "Zapier Webhook",
  stepId: "zapier",
  type: "ACTION",
  description: "Trigger a Zapier Zap via webhooks",
  tagline: "Trigger a Zapier Zap",
  icon: "ri-flashlight-line",
  schema: {
    inputs: {
      properties: {
        url: {
          type: "string",
          title: "Webhook URL",
        },
        value1: {
          type: "string",
          title: "Payload Value 1",
        },
        value2: {
          type: "string",
          title: "Payload Value 2",
        },
        value3: {
          type: "string",
          title: "Payload Value 3",
        },
        value4: {
          type: "string",
          title: "Payload Value 4",
        },
        value5: {
          type: "string",
          title: "Payload Value 5",
        },
      },
      required: ["url"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: "number",
          description: "The HTTP status code of the request",
        },
        zapierStatus: {
          type: "string",
          description: "The result status from Zapier",
        },
      },
    },
  },
}

exports.run = async function ({ inputs }) {
  const { url, value1, value2, value3, value4, value5 } = inputs

  // send the platform to make sure zaps always work, even
  // if no values supplied
  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      platform: "budibase",
      value1,
      value2,
      value3,
      value4,
      value5,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  let data = null
  if (response.status === 200) {
    try {
      data = await response.json()
    } catch (err) {
      data = null
    }
  }

  return {
    httpStatus: response.status,
    zapierStatus: data && data.status ? data.status : data,
  }
}
