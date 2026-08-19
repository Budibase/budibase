import { ToolType, ToolExecutionPrincipal } from "@budibase/types"
import { describe, expect, it } from "vitest"

import {
  getDefaultToolExecutionPrincipal,
  isToolReferenced,
  normalizeConfiguredOperationTools,
} from "./toolBindingUtils"
import type { AgentTool } from "./toolTypes"

describe("normalizeConfiguredOperationTools", () => {
  const availableTools: AgentTool[] = [
    {
      name: "search_rows",
      description: "Search rows",
      sourceType: ToolType.INTERNAL_TABLE,
      readableBinding: "budibase.Employees.search_rows",
      runtimeBinding: "ta_employees_search_rows",
      executionPolicy: {
        mode: "configurable",
        defaultPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
    },
  ]

  it("preserves configured tools when they are not referenced in instructions", () => {
    expect(
      normalizeConfiguredOperationTools({
        operation: {
          id: "operation_1",
          name: "Support",
          live: false,
          allowKnowledgeSourceDownload: false,
          promptInstructions: "No tool references",
          enabledTools: [
            {
              toolName: "ta_employees_search_rows",
              executionPrincipal: ToolExecutionPrincipal.REQUESTER,
            },
          ],
        },
        availableTools,
      })
    ).toEqual([
      {
        toolName: "ta_employees_search_rows",
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
    ])
  })

  it("does not configure tools merely because the prompt references them", () => {
    expect(
      normalizeConfiguredOperationTools({
        operation: {
          id: "operation_1",
          name: "Support",
          live: false,
          allowKnowledgeSourceDownload: false,
          promptInstructions: "Use {{ budibase.Employees.search_rows }}",
          enabledTools: [],
        },
        availableTools,
      })
    ).toEqual([])
  })

  it("preserves configured tools that are temporarily unavailable", () => {
    expect(
      normalizeConfiguredOperationTools({
        operation: {
          id: "operation_1",
          name: "Support",
          live: false,
          allowKnowledgeSourceDownload: false,
          enabledTools: [
            {
              toolName: "missing_tool",
              executionPrincipal: ToolExecutionPrincipal.REQUESTER,
            },
          ],
        },
        availableTools,
      })
    ).toEqual([
      {
        toolName: "missing_tool",
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
    ])
  })

  it("enforces fixed-admin tool policies", () => {
    const adminTool: AgentTool = {
      ...availableTools[0],
      executionPolicy: { mode: "admin" },
    }
    expect(
      normalizeConfiguredOperationTools({
        operation: {
          id: "operation_1",
          name: "Support",
          live: false,
          allowKnowledgeSourceDownload: false,
          enabledTools: [
            {
              toolName: adminTool.runtimeBinding,
              executionPrincipal: ToolExecutionPrincipal.REQUESTER,
            },
          ],
        },
        availableTools: [adminTool],
      })
    ).toEqual([
      {
        toolName: adminTool.runtimeBinding,
        executionPrincipal: ToolExecutionPrincipal.ADMIN,
      },
    ])
  })

  it("uses the tool policy default for newly configured tools", () => {
    expect(
      getDefaultToolExecutionPrincipal({
        tool: availableTools[0],
        toolSecurityEnabled: true,
      })
    ).toBe(ToolExecutionPrincipal.REQUESTER)
  })

  it("detects prompt references with optional whitespace", () => {
    expect(
      isToolReferenced({
        prompt: "Use {{budibase.Employees.search_rows}} when needed",
        tool: availableTools[0],
      })
    ).toBe(true)
    expect(
      isToolReferenced({
        prompt: "No tools here",
        tool: availableTools[0],
      })
    ).toBe(false)
  })

})
