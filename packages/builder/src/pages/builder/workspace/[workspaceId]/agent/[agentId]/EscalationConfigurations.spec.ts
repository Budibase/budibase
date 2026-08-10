import { render, screen } from "@testing-library/svelte"
import {
  EscalationNotificationChannel,
  ToolExecutionPrincipal,
  type Agent,
} from "@budibase/types"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockComponent from "@/test/mocks/MockComponent.svelte"

vi.mock("@budibase/bbui", () => ({
  ActionButton: MockButton,
  Body: MockBody,
  Button: MockButton,
  Helpers: { uuid: () => "123" },
  Input: MockInput,
}))

vi.mock("@/components/common/EscalationRecipients.svelte", () => ({
  default: MockComponent,
}))

import EscalationConfigurations from "./EscalationConfigurations.svelte"

describe("EscalationConfigurations", () => {
  it("shows where a referenced reusable configuration is used", () => {
    const agent: Agent = {
      name: "Support agent",
      aiconfig: "config-1",
      escalationConfigs: [
        {
          id: "escalation_config_engineering",
          name: "Engineering",
          recipient: {
            type: EscalationNotificationChannel.SLACK,
            config: { channelId: "C1", channelName: "engineering" },
          },
        },
      ],
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          allowKnowledgeSourceDownload: true,
          enabledTools: [
            {
              toolName: "create_row",
              executionPrincipal: ToolExecutionPrincipal.REQUESTER,
              escalationConfigId: "escalation_config_engineering",
            },
          ],
        },
      ],
    }

    render(EscalationConfigurations, {
      props: { agent, onUpdated: vi.fn(async () => true) },
    })

    expect(screen.getByDisplayValue("Engineering")).toBeInTheDocument()
    expect(screen.getByText("Used by Main: create_row")).toBeInTheDocument()
  })
})
