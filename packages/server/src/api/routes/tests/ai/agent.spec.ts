import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../../tests/utilities/aiConfig"

describe("agent duplicate", () => {
  const config = new TestConfiguration()
  let cleanupAIConfig: undefined | (() => Promise<void>)

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    await config.newTenant()
    cleanupAIConfig = await setupDefaultCompletionsAIConfig(config, "default")
  })

  afterEach(async () => {
    await cleanupAIConfig?.()
    cleanupAIConfig = undefined
  })

  it("duplicates an agent with a unique copy name", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "Support Agent",
        aiconfig: "default",
        description: "Support assistant",
        live: true,
      },
      {
        id: "operation_1",
        name: "Customer support",
        live: false,
        promptInstructions: "Be helpful",
        enabledTools: [],
        allowKnowledgeSourceDownload: true,
      }
    )

    const duplicate = await config.api.agent.duplicate(created._id!)

    expect(duplicate._id).toBeDefined()
    expect(duplicate._id).not.toEqual(created._id)
    expect(duplicate.name).not.toEqual(created.name)
    expect(duplicate.name).toContain("Support Agent")
    expect(duplicate.description).toEqual(created.description)
    expect(duplicate.operations?.[0]?.promptInstructions).toEqual(
      created.operations?.[0]?.promptInstructions
    )
    expect(duplicate.operations?.[0]?.name).toEqual(
      created.operations?.[0]?.name
    )
    expect(duplicate.live).toEqual(created.live)
  })

  it("persists operation name on create and update", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "Operation Name Agent",
        aiconfig: "default",
      },
      {
        id: "operation_1",
        name: "Main triage flow",
        live: false,
        enabledTools: [],
        allowKnowledgeSourceDownload: true,
      }
    )
    expect(created.operations?.[0]?.name).toEqual("Main triage flow")

    const updated = await config.api.agent.updateOperation(
      created._id!,
      created.operations?.[0]?.id || "operation_1",
      {
        name: "Escalation flow",
      }
    )
    expect(updated.operations?.[0]?.name).toEqual("Escalation flow")

    const { agents } = await config.api.agent.fetch()
    const fetched = agents.find(agent => agent._id === created._id)
    expect(fetched?.operations?.[0]?.name).toEqual("Escalation flow")
  })

  it("creates, updates, and deletes an operation via dedicated endpoints", async () => {
    const created = await config.api.agent.create({
      name: "Operation CRUD Agent",
      aiconfig: "default",
    })

    const withOperation = await config.api.agent.createOperation(created._id!, {
      id: "operation_2",
      name: "Support flow",
      live: false,
      promptInstructions: "Help users",
      enabledTools: [],
      allowKnowledgeSourceDownload: true,
    })
    expect(withOperation.operations?.map(operation => operation.id)).toContain(
      "operation_2"
    )

    const renamed = await config.api.agent.updateOperation(
      created._id!,
      "operation_2",
      {
        name: "Escalation flow",
      }
    )
    expect(
      renamed.operations?.find(operation => operation.id === "operation_2")
        ?.name
    ).toEqual("Escalation flow")

    const removed = await config.api.agent.deleteOperation(
      created._id!,
      "operation_2"
    )
    expect(
      removed.operations?.find(operation => operation.id === "operation_2")
    ).toBeUndefined()
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

  it("keeps publication history after pausing a live agent", async () => {
    const created = await config.api.agent.create({
      name: "Status Agent",
      aiconfig: "default",
    })
    expect(created.publishedAt).toBeUndefined()

    const published = await config.api.agent.update({
      ...created,
      live: true,
    })
    expect(published.publishedAt).toBeDefined()

    const stopped = await config.api.agent.update({
      ...published,
      live: false,
    })
    expect(stopped.publishedAt).toEqual(published.publishedAt)
  })
})
