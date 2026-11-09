import { fireEvent, render, screen } from "@testing-library/svelte"
import {
  ResourceType,
  type ImportProjectResponse,
  type ProjectImportRequirement,
} from "@budibase/types"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Button: MockButton,
  Icon: MockIcon,
  ModalContent: MockModalContent,
}))

import ImportProjectResultModal from "./ImportProjectResultModal.svelte"

const createResponse = (
  overrides: Partial<ImportProjectResponse> = {}
): ImportProjectResponse => ({
  project: {
    _id: "project_1",
    _rev: "1-project",
    name: "Support",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  resources: {},
  requirements: [],
  unsupportedContent: [],
  ...overrides,
})

describe("ImportProjectResultModal", () => {
  it("groups setup tasks by resource and shows omitted content", async () => {
    const response = createResponse({
      resources: {
        [ResourceType.AGENT]: ["agent_1"],
        [ResourceType.DATASOURCE]: ["datasource_2"],
      },
      requirements: [
        {
          type: "agent_secrets",
          resourceId: "agent_1",
          name: "Support agent",
          reason: "Reconnect the Slack integration.",
        },
        {
          type: "agent_ai_config",
          resourceId: "agent_1",
          name: "Support agent",
          reason: "Choose an AI model.",
        },
        {
          type: "datasource_secrets",
          resourceId: "datasource_2",
          name: "Customer database",
          reason: "Reconnect the database.",
        },
      ],
      unsupportedContent: [
        {
          type: "agent_linked_content",
          count: 3,
          reason: "Agent chats are excluded from Project exports.",
        },
      ],
    })
    const onOpenResource = vi.fn()
    render(ImportProjectResultModal, {
      response,
      onOpenResource,
    })

    const agentButton = screen.getByRole("button", {
      name: "Configure Support agent",
    })
    const databaseButton = screen.getByRole("button", {
      name: "Connect Customer database",
    })
    expect(screen.getByText("Project imported")).toBeInTheDocument()
    expect(screen.getByText(response.project.name)).toBeInTheDocument()
    expect(
      screen.getByText(
        /You can finish setup later from “Project setup” in the project menu/
      )
    ).toBeInTheDocument()
    expect(document.querySelector('[data-icon="check-circle"]')).toBeTruthy()
    expect(
      screen.getByRole("heading", { name: "2 items need setup" })
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole("heading", { level: 3, name: "Support agent" })
    ).toHaveLength(1)
    expect(
      screen.getByText("Add connection credentials for this data source.")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Reconnect integrations in the Deployment tab.")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Choose an AI model for this agent.")
    ).toBeInTheDocument()
    expect(
      screen.getByText(`${response.unsupportedContent[0].reason} (3)`)
    ).toBeInTheDocument()
    expect(
      screen.getByText("What wasn’t imported").closest("details")
    ).not.toHaveAttribute("open")
    expect(screen.queryByText(/agent_linked_content/)).toBeNull()
    expect(
      screen.getByRole("button", { name: "View project" })
    ).toBeInTheDocument()

    await fireEvent.click(agentButton)
    expect(onOpenResource).toHaveBeenCalledExactlyOnceWith(
      response.requirements[0]
    )
    await fireEvent.click(databaseButton)
    expect(onOpenResource).toHaveBeenLastCalledWith(response.requirements[2])
  })

  it("does not suggest setup or omitted content when neither is present", () => {
    render(ImportProjectResultModal, {
      response: createResponse({
        resources: { [ResourceType.WORKSPACE_APP]: ["app_1"] },
      }),
      onOpenResource: vi.fn(),
    })

    expect(screen.getByText("Support")).toBeInTheDocument()
    expect(screen.queryByText(/setup/i)).toBeNull()
    expect(screen.queryByText("What wasn’t imported")).toBeNull()
    expect(
      screen.getByRole("button", { name: "View project" })
    ).toBeInTheDocument()
  })

  it("advances an agent's action to its remaining requirement after model setup", async () => {
    const requirements: ProjectImportRequirement[] = [
      {
        type: "agent_ai_config",
        resourceId: "agent_1",
        name: "Support agent",
        reason: "Choose an AI model.",
      },
      {
        type: "agent_secrets",
        resourceId: "agent_1",
        name: "Support agent",
        reason: "Reconnect the Slack integration.",
      },
    ]
    const onOpenResource = vi.fn()
    const { rerender } = render(ImportProjectResultModal, {
      response: createResponse({ requirements }),
      onOpenResource,
    })

    await fireEvent.click(
      screen.getByRole("button", { name: "Configure Support agent" })
    )
    await rerender({
      response: createResponse({ requirements: [requirements[1]] }),
      onOpenResource,
      isSetupReview: true,
    })
    await fireEvent.click(
      screen.getByRole("button", { name: "Configure Support agent" })
    )

    expect(onOpenResource.mock.calls).toEqual([
      [requirements[0]],
      [requirements[1]],
    ])
    expect(screen.queryByText("Choose an AI model for this agent.")).toBeNull()
  })

  it("explains how to reconnect an automation and opens it", async () => {
    const response = createResponse({
      requirements: [
        {
          type: "automation_credentials",
          resourceId: "automation_1",
          name: "Incoming support emails",
          reason: "Mailbox credentials are workspace-specific.",
        },
      ],
    })
    const onOpenResource = vi.fn()
    render(ImportProjectResultModal, { response, onOpenResource })

    expect(
      screen.getByRole("heading", { name: "1 item needs setup" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Reconnect the mailbox before enabling this automation.")
    ).toBeInTheDocument()

    await fireEvent.click(
      screen.getByRole("button", { name: "Reconnect Incoming support emails" })
    )

    expect(onOpenResource).toHaveBeenCalledExactlyOnceWith(
      response.requirements[0]
    )
  })

  it("presents remaining setup without announcing a new import when reopened", () => {
    render(ImportProjectResultModal, {
      response: createResponse({
        requirements: [
          {
            type: "agent_ai_config",
            resourceId: "agent_1",
            name: "Support agent",
            reason: "Choose an AI model.",
          },
        ],
      }),
      onOpenResource: vi.fn(),
      isSetupReview: true,
    })

    expect(screen.getByText("Project setup")).toBeInTheDocument()
    expect(screen.queryByText("Project imported")).toBeNull()
    expect(screen.queryByText(/is now in your workspace/)).toBeNull()
    expect(screen.queryByText(/You can finish setup later/)).toBeNull()
    expect(document.querySelector('[data-icon="list-checks"]')).toBeTruthy()
    expect(document.querySelector('[data-icon="warning"]')).toBeNull()
    expect(
      screen.getByRole("button", { name: "Configure Support agent" })
    ).toBeInTheDocument()
  })

  it("shows completed setup when reopened with no remaining requirements", () => {
    render(ImportProjectResultModal, {
      response: createResponse(),
      onOpenResource: vi.fn(),
      isSetupReview: true,
    })

    expect(screen.getByText("Project setup")).toBeInTheDocument()
    expect(screen.getByText("No setup items remaining.")).toBeInTheDocument()
    expect(document.querySelector('[data-icon="list-checks"]')).toBeTruthy()
    expect(document.querySelector('[data-icon="check-circle"]')).toBeNull()
    expect(
      screen.queryByRole("button", { name: /Configure|Connect/ })
    ).toBeNull()
  })
})
