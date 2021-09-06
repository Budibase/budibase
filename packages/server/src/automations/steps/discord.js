const fetch = require("node-fetch")

exports.definition = {
  name: "Discord Message",
  tagline: "Send a message to a Discord server",
  description: "Send a message to a Discord server",
  icon: "ri-discord-line",
  stepId: "discord",
  type: "ACTION",
  inputs: {
    username: "Budibase Automate",
    avatar_url: "https://i.imgur.com/a1cmTKM.png",
  },
  schema: {
    inputs: {
      properties: {
        url: {
          type: "string",
          title: "Discord Webhook URL",
        },
        username: {
          type: "string",
          title: "Bot Name",
        },
        avatar_url: {
          type: "string",
          title: "Bot Avatar URL",
        },
        content: {
          type: "string",
          title: "Message",
        },
      },
      required: ["url", "content"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: "number",
          description: "The HTTP status code of the request",
        },
      },
    },
  },
}

exports.run = async function ({ inputs }) {
  const { url, username, avatar_url, content } = inputs

  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      username,
      avatar_url,
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  return {
    httpStatus: response.status,
  }
}
