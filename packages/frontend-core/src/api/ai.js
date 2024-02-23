export const buildAIEndpoints = API => ({
  /**
   * Generic LLM Prompt with free user input.
   */
  aiPrompt: async ({ prompt, model }) => {
    return await API.post({
      url: "/api/ai/prompt",
      body: { prompt, model },
    })
  },
  /**
   * Summarize text using LLMs.
   */
  aiSummarizeText: async ({ prompt, model }) => {
    return await API.post({
      url: "/api/ai/summarizetext",
      body: { prompt, model },
    })
  },
  /**
   * Generate SQL queries for a certain datasource and table.
   */
  aiGenerateSQL: async ({ prompt, model, datasourceId, tableName }) => {
    return await API.post({
      url: "/api/ai/generate/sql",
      body: { prompt, model, tableName, datasourceId },
    })
  },
})
