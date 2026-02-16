import { AgentEvalCase, EvalMode } from "./types"

const smokeCases: AgentEvalCase[] = [
  {
    id: "automation_no_tools_short_answer",
    title: "Automation no tools concise response",
    surface: "automation",
    tooling: "none",
    prompt: "Reply with exactly: budibase-eval-ok",
    forbiddenTools: ["list_tables", "get_table"],
    responseMustContain: ["budibase-eval-ok"],
  },
  {
    id: "automation_tables_tool_usage",
    title: "Automation uses list_tables before answer",
    surface: "automation",
    tooling: "tables",
    prompt:
      "Use the list_tables tool first, then answer with the exact text: table-check-complete",
    requiredTools: ["list_tables"],
    responseMustContain: ["table-check-complete"],
  },
  {
    id: "chat_no_tools_short_answer",
    title: "Chat no tools concise response",
    surface: "chat",
    tooling: "none",
    prompt: "Reply with exactly: chat-eval-ok",
    responseMustContain: ["chat-eval-ok"],
  },
]

const fullOnlyCases: AgentEvalCase[] = [
  {
    id: "automation_tables_get_table",
    title: "Automation uses get_table",
    surface: "automation",
    tooling: "tables",
    prompt:
      "Use get_table on the first table id from list_tables, then answer exactly: get-table-complete",
    requiredTools: ["list_tables", "get_table"],
    responseMustContain: ["get-table-complete"],
  },
  {
    id: "automation_no_markdown",
    title: "Automation plain output rule",
    surface: "automation",
    tooling: "none",
    prompt: "Return a plain sentence with no markdown: this is plain text",
    forbiddenTools: ["list_tables", "get_table"],
    responseMustContain: ["this is plain text"],
    responseMustNotContain: ["**", "```", "# "],
  },
  {
    id: "chat_tables_tool_usage",
    title: "Chat uses list_tables before answering",
    surface: "chat",
    tooling: "tables",
    prompt:
      "Use the list_tables tool first, then answer with the exact text: chat-table-check-complete",
    requiredTools: ["list_tables"],
    responseMustContain: ["chat-table-check-complete"],
  },
  {
    id: "chat_concise_answer",
    title: "Chat concise answer quality",
    surface: "chat",
    tooling: "none",
    prompt: "In one short sentence, explain what Budibase is.",
    responseMustContain: ["Budibase"],
  },
]

export function getCases(mode: EvalMode): AgentEvalCase[] {
  if (mode === "smoke") {
    return smokeCases
  }
  return [...smokeCases, ...fullOnlyCases]
}
