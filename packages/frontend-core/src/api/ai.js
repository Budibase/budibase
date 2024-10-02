export const buildAIEndpoints = API => ({
  /**
   * Generates a cron expression from a prompt
   */
  generateCronExpression: async ({ prompt }) => {
    return await API.post({
      url: "/api/ai/cron",
      body: { prompt },
    })
  },
})
