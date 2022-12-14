import { enrichPluginURLs } from "../plugins"
const env = require("../../environment")
jest.mock("../../environment")

describe("plugins utility", () => {
  let pluginsArray: any = [
    {
      name: "test-plugin",
    },
  ]
  it("enriches the plugins url self-hosted", async () => {
    let result = enrichPluginURLs(pluginsArray)
    expect(result[0].jsUrl).toEqual("/plugins/test-plugin/plugin.min.js")
  })

  it("enriches the plugins url cloud", async () => {
    env.SELF_HOSTED = 0
    let result = enrichPluginURLs(pluginsArray)
    expect(result[0].jsUrl).toEqual(
      "https://cdn.budi.live/test-plugin/plugin.min.js"
    )
  })
})
