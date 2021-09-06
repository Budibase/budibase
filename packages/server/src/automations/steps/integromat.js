const fetch = require("node-fetch")

exports.definition = {
  name: "Integromat Integration",
  tagline: "Trigger an Integromat scenario",
  description:
    "Performs a webhook call to Integromat and gets the response (if configured)",
  icon: "ri-shut-down-line",
  stepId: "integromat",
  type: "ACTION",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: "string",
          title: "Webhook URL",
        },
        value1: {
          type: "string",
          title: "Input Value 1",
        },
        value2: {
          type: "string",
          title: "Input Value 2",
        },
        value3: {
          type: "string",
          title: "Input Value 3",
        },
        value4: {
          type: "string",
          title: "Input Value 4",
        },
        value5: {
          type: "string",
          title: "Input Value 5",
        },
      },
      required: ["url", "value1", "value2", "value3", "value4", "value5"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether call was successful",
        },
        response: {
          type: "object",
          description: "The webhook response - this can have properties",
        },
      },
      required: ["success", "response"],
    },
  },
}

exports.run = async function ({ inputs }) {
  const { url, value1, value2, value3, value4, value5 } = inputs

  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify({
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

  let data
  if (response.status === 200) {
    try {
      data = await response.json()
    } catch (err) {
      data = {}
    }
  } else {
    data = await response.text()
  }

  return {
    success: response.status === 200,
    response: data,
  }
}
