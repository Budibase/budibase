require("ts-node/register/transpile-only")
require("tsconfig-paths/register")

const { runPromptfooEvalCase } = require("./promptfooRuntime")

module.exports = {
  id: "budibase-agent-eval-runtime",
  callApi: async (_prompt, context) => {
    const vars = context?.vars || {}

    const testCase = {
      id: vars.caseId,
      title: vars.caseTitle || vars.caseId,
      surface: vars.surface,
      tooling: vars.tooling || "none",
      prompt: vars.prompt,
      requiredTools: vars.requiredTools || [],
      forbiddenTools: vars.forbiddenTools || [],
      responseMustContain: vars.responseMustContain || [],
      responseMustNotContain: vars.responseMustNotContain || [],
    }

    const result = await runPromptfooEvalCase({
      modelId: vars.modelId,
      provider: vars.provider,
      testCase,
    })

    return {
      output: result.trace.responseText,
      metadata: result,
    }
  },
}
