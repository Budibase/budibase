import { render, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockSearch from "@/test/mocks/MockSearch.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"

const mocks = vi.hoisted(() => {
  const store = <T>(initial: T) => {
    let value = initial
    const subscribers = new Set<(value: T) => void>()
    return {
      set: (next: T) => {
        value = next
        subscribers.forEach(run => run(value))
      },
      subscribe: (run: (value: T) => void) => {
        subscribers.add(run)
        run(value)
        return () => subscribers.delete(run)
      },
    }
  }

  return {
    focus: vi.fn(),
    automationStore: store({
      actionPanelToolbarFlowEnd: false,
      blockDefinitions: { ACTION: {}, TRIGGER: {} },
    }),
    selectedAutomation: store({
      data: {
        definition: {
          trigger: { stepId: "APP" },
        },
      },
      blockRefs: {},
    }),
    admin: store({
      checklist: {
        smtp: { checked: true, fallback: false },
      },
    }),
    licensing: store({
      syncAutomationsEnabled: true,
      triggerAutomationRunEnabled: true,
    }),
    restTemplates: store({
      templates: [],
    }),
  }
})

Object.assign(mocks.automationStore, {
  actions: {
    addBlockToAutomation: vi.fn(),
    addBlockToLoopChildren: vi.fn(),
    closeActionPanel: vi.fn(),
    constructBlock: vi.fn(),
    getBlockByRef: vi.fn(),
    getPathSteps: vi.fn(() => []),
    getToolbarFlowEndInsertion: vi.fn(),
    openApiRequestTemplate: vi.fn(),
    selectNode: vi.fn(),
  },
})

Object.assign(mocks.restTemplates, {
  get: vi.fn(),
})

vi.mock("@budibase/bbui", () => ({
  Body: MockSlot,
  Detail: MockSlot,
  Icon: MockIcon,
  Search: MockSearch,
  Tag: MockSlot,
  Tags: MockSlot,
  notifications: { error: vi.fn() },
}))

vi.mock("@budibase/types", () => ({
  AutomationActionStepId: {
    AGENT: "AGENT",
    API_REQUEST: "API_REQUEST",
    BRANCH: "BRANCH",
    CLASSIFY_CONTENT: "CLASSIFY_CONTENT",
    COLLECT: "COLLECT",
    CREATE_ROW: "CREATE_ROW",
    DELAY: "DELAY",
    DELETE_ROW: "DELETE_ROW",
    EXECUTE_BASH: "EXECUTE_BASH",
    EXECUTE_QUERY: "EXECUTE_QUERY",
    EXECUTE_SCRIPT_V2: "EXECUTE_SCRIPT_V2",
    EXTRACT_FILE_DATA: "EXTRACT_FILE_DATA",
    EXTRACT_STATE: "EXTRACT_STATE",
    FILTER: "FILTER",
    GENERATE_TEXT: "GENERATE_TEXT",
    GET_ROW: "GET_ROW",
    LOOP: "LOOP",
    LOOP_V2: "LOOP_V2",
    OPENAI: "OPENAI",
    PROMPT_LLM: "PROMPT_LLM",
    QUERY_ROWS: "QUERY_ROWS",
    SEND_EMAIL_SMTP: "SEND_EMAIL_SMTP",
    SERVER_LOG: "SERVER_LOG",
    SUMMARISE: "SUMMARISE",
    TRANSLATE: "TRANSLATE",
    TRIGGER_AUTOMATION_RUN: "TRIGGER_AUTOMATION_RUN",
    UPDATE_ROW: "UPDATE_ROW",
    discord: "discord",
    integromat: "integromat",
    n8n: "n8n",
    slack: "slack",
    zapier: "zapier",
  },
  AutomationTriggerStepId: {
    APP: "APP",
    CRON: "CRON",
    ROW_ACTION: "ROW_ACTION",
    ROW_DELETED: "ROW_DELETED",
    ROW_SAVED: "ROW_SAVED",
    ROW_UPDATED: "ROW_UPDATED",
    WEBHOOK: "WEBHOOK",
  },
  BlockDefinitionTypes: { ACTION: "ACTION" },
  isBranchStep: vi.fn(() => false),
}))

vi.mock("@/constants/backend/automations", () => ({
  ActionStepID: {
    COLLECT: "COLLECT",
    TRIGGER_AUTOMATION_RUN: "TRIGGER_AUTOMATION_RUN",
  },
  TriggerStepID: {
    APP: "APP",
    WEBHOOK: "WEBHOOK",
  },
}))

vi.mock("@/stores/builder", () => ({
  automationStore: mocks.automationStore,
  selectedAutomation: mocks.selectedAutomation,
}))

vi.mock("@/stores/portal", () => ({
  admin: mocks.admin,
  licensing: mocks.licensing,
}))

vi.mock("@/stores/builder/restTemplates", () => ({
  restTemplates: mocks.restTemplates,
}))

vi.mock("@/components/common/ResizablePanel.svelte", () => ({
  default: MockSlot,
}))

vi.mock("@/components/design/Panel.svelte", () => ({
  default: MockSlot,
}))

vi.mock("@/components/common/NewPill.svelte", () => ({
  default: MockSlot,
}))

import SelectStepSidePanel from "../SelectStepSidePanel.svelte"

describe("SelectStepSidePanel", () => {
  beforeEach(() => {
    mocks.focus.mockReset()
    vi.spyOn(HTMLInputElement.prototype, "focus").mockImplementation(
      mocks.focus
    )
    Element.prototype.animate = vi.fn(
      () =>
        ({
          cancel: vi.fn(),
          finish: vi.fn(),
          onfinish: null,
        }) as unknown as Animation
    )
  })

  it("focuses search without scrolling the canvas while the panel opens", async () => {
    render(SelectStepSidePanel, {
      props: {
        block: { id: "step-1" },
      },
    })

    await waitFor(() => {
      expect(mocks.focus).toHaveBeenCalledWith({ preventScroll: true })
    })
  })
})
