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

  it("rejects creating a second agent with a duplicate name", async () => {
    const name = "Duplicate Agent Name"
    await config.api.agent.create({
      name,
      aiconfig: "default",
    })

    await config.api.agent.create(
      {
        name,
        aiconfig: "default",
      },
      {
        status: 400,
        body: {
          message: `Agent with name '${name}' already exists.`,
        },
      }
    )
  })

  it("rejects updating an agent to use a duplicate name", async () => {
    const first = await config.api.agent.create({
      name: "First Agent Name",
      aiconfig: "default",
    })
    const second = await config.api.agent.create({
      name: "Second Agent Name",
      aiconfig: "default",
    })

    await config.api.agent.update(
      {
        ...second,
        name: first.name,
      },
      {
        status: 400,
        body: {
          message: `Agent with name '${first.name}' already exists.`,
        },
      }
    )
  })

  it("rejects creating an agent with a whitespace-only name", async () => {
    await config.api.agent.create(
      {
        name: "   ",
        aiconfig: "default",
      },
      {
        status: 400,
        body: {
          message: "Agent name is required.",
        },
      }
    )
  })

  it("rejects updating an agent with a whitespace-only name", async () => {
    const created = await config.api.agent.create({
      name: "Valid Agent Name",
      aiconfig: "default",
    })

    await config.api.agent.update(
      {
        ...created,
        name: "   ",
      },
      {
        status: 400,
        body: {
          message: "Agent name is required.",
        },
      }
    )
  })
})
