import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("agent duplicate", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  it("duplicates an agent with a unique copy name", async () => {
    const created = await config.api.agent.create({
      name: "Support Agent",
      aiconfig: "default",
      description: "Support assistant",
      promptInstructions: "Be helpful",
      live: true,
    })

    const duplicate = await config.api.agent.duplicate(created._id!)

    expect(duplicate._id).toBeDefined()
    expect(duplicate._id).not.toEqual(created._id)
    expect(duplicate.name).not.toEqual(created.name)
    expect(duplicate.name).toContain("Support Agent")
    expect(duplicate.description).toEqual(created.description)
    expect(duplicate.promptInstructions).toEqual(created.promptInstructions)
    expect(duplicate.live).toEqual(created.live)
  })

  it("returns 404 for unknown agent", async () => {
    await config.api.agent.duplicate("ag_missing", { status: 404 })
  })
})
