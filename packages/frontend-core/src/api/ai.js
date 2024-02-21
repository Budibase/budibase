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
})
