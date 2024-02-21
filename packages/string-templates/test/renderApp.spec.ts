import { processString } from "../src/index"

describe("specific test case for whether or not full app template can still be rendered", () => {
  it("should be able to render the app template", async () => {
    const template = `<!doctype html>
        <html>
        <head>
          {{{head}}}
        </head>
        <script>
          window["##BUDIBASE_APP_ID##"] = "{{appId}}"
        </script>
        {{{body}}}
        </html>`
    const context = {
      appId: "App1",
      head: "<title>App</title>",
      body: "<body><p>App things</p></body>",
    }
    const output = await processString(template, context)
    expect(output).toBe(`<!doctype html>
        <html>
        <head>
          <title>App</title>
        </head>
        <script>
          window["##BUDIBASE_APP_ID##"] = "App1"
        </script>
        <body><p>App things</p></body>
        </html>`)
  })
})
