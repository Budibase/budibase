import { render, screen } from "@testing-library/svelte"
import {
  EscalationNotificationChannel,
  ToolExecutionPrincipal,
  type AgentOperation,
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

describe("ApprovalPolicies", () => {
  it("shows where a referenced reusable policy is used", () => {
    const operation: AgentOperation = {
      id: "operation_1",
      name: "Main",
      live: false,
      allowKnowledgeSourceDownload: true,
      approvalPolicies: [
        {
          id: "approval_policy_engineering",
          name: "Engineering",
          recipients: [
            {
              type: EscalationNotificationChannel.SLACK,
              config: { channelId: "C1", channelName: "engineering" },
            },
          ],
        },
      ],
      enabledTools: [
        {
          toolName: "create_row",
          executionPrincipal: ToolExecutionPrincipal.REQUESTER,
          approvalPolicyId: "approval_policy_engineering",
        },
      ],
    }

    render(EscalationConfigurations, {
      props: { operation, onUpdated: vi.fn(async () => true) },
    })

    expect(screen.getByDisplayValue("Engineering")).toBeInTheDocument()
    expect(screen.getByText("Used by Create Row")).toBeInTheDocument()
  })
})
