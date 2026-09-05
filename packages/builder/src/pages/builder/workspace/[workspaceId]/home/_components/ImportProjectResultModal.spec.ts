import { fireEvent, render, screen } from "@testing-library/svelte"
import { ResourceType, type ImportProjectResponse } from "@budibase/types"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Button: MockButton,
  ModalContent: MockModalContent,
}))

import ImportProjectResultModal from "./ImportProjectResultModal.svelte"

describe("ImportProjectResultModal", () => {
  it("groups setup reasons by resource and explains omitted content", async () => {
    const response: ImportProjectResponse = {
      project: {
        _id: "project_1",
        _rev: "1-project",
        name: "Support",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      resources: { [ResourceType.AGENT]: ["agent_1"] },
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
      ],
      unsupportedContent: [
        {
          type: "agent_linked_content",
          count: 1,
          reason: "Agent chats are excluded from Project exports.",
        },
      ],
    }
    const onOpenResource = vi.fn()
    render(ImportProjectResultModal, {
      response,
      onOpenResource,
    })

    const buttons = screen.getAllByRole("button", { name: "Support agent" })
    expect(buttons).toHaveLength(1)
    expect(screen.getByText("Reconnect the Slack integration.")).toBeTruthy()
    expect(screen.getByText("Choose an AI model.")).toBeTruthy()
    expect(screen.getByText(response.unsupportedContent[0].reason)).toBeTruthy()
    expect(screen.queryByText(/agent_linked_content/)).toBeNull()

    await fireEvent.click(buttons[0])
    expect(onOpenResource).toHaveBeenCalledExactlyOnceWith(
      response.requirements[0]
    )
  })
})
