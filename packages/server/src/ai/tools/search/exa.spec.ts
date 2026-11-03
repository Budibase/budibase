import { createExaTool } from "./exa"

describe("createExaTool", () => {
  const fetchSpy = jest.spyOn(global, "fetch")

  afterEach(() => {
    fetchSpy.mockReset()
  })

  afterAll(() => {
    fetchSpy.mockRestore()
  })

  it("sends the requested result count as numResults", async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ results: [] }), { status: 200 })
    )

    const exaTool = createExaTool("test-key")
    await exaTool.tool.execute!(
      { query: "budibase", num_results: 3 },
      { toolCallId: "call-1", messages: [] }
    )

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe("https://api.exa.ai/search")
    const body = JSON.parse((init as RequestInit).body as string)
    expect(body).toEqual({ query: "budibase", numResults: 3 })
  })
})
