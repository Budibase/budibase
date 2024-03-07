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
  /**
   * Generate JS code.
   */
  aiGenerateCode: async ({ prompt, model, datasourceId, tableName }) => {
    return await API.post({
      url: "/api/ai/generate/js",
      body: { prompt, model },
    })
  },
  /**
   * Generate a Budibase table schema.
   */
  aiGenerateTableSchema: async ({ prompt, model }) => {
    return await API.post({
      url: "/api/ai/generate/table",
      body: { prompt, model },
    })
  },
  /**
   * Generate a Budibase screen.
   */
  aiGenerateScreen: async ({ prompt, model }) => {
    return await API.post({
      url: "/api/ai/generate/screen",
      body: { prompt, model },
    })
  },
})
