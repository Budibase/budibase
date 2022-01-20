export const buildAutomationEndpoints = API => ({
  /**
   * Executes an automation. Must have "App Action" trigger.
   */
  triggerAutomation: async ({ automationId, fields }) => {
    return await API.post({
      url: `/api/automations/${automationId}/trigger`,
      body: { fields },
    })
  },
})
