export const buildAutomationEndpoints = API => ({
  /**
   * Executes an automation. Must have "App Action" trigger.
   * @param automationId the ID of the automation to trigger
   * @param fields the fields to trigger the automation with
   */
  triggerAutomation: async ({ automationId, fields, timeout }) => {
    return await API.post({
      url: `/api/automations/${automationId}/trigger`,
      body: { fields, timeout },
    })
  },

  /**
   * Tests an automation with data.
   * @param automationId the ID of the automation to test
   * @param testData the test data to run against the automation
   */
  testAutomation: async ({ automationId, testData }) => {
    return await API.post({
      url: `/api/automations/${automationId}/test`,
      body: testData,
    })
  },

  /**
   * Gets a list of all automations.
   */
  getAutomations: async () => {
    return await API.get({
      url: "/api/automations",
    })
  },

  /**
   * Gets a list of all the definitions for blocks in automations.
   */
  getAutomationDefinitions: async () => {
    return await API.get({
      url: "/api/automations/definitions/list",
    })
  },

  /**
   * Creates an automation.
   * @param automation the automation to create
   */
  createAutomation: async automation => {
    return await API.post({
      url: "/api/automations",
      body: automation,
    })
  },

  /**
   * Updates an automation.
   * @param automation the automation to update
   */
  updateAutomation: async automation => {
    return await API.put({
      url: "/api/automations",
      body: automation,
    })
  },

  /**
   * Deletes an automation
   * @param automationId the ID of the automation to delete
   * @param automationRev the rev of the automation to delete
   */
  deleteAutomation: async ({ automationId, automationRev }) => {
    return await API.delete({
      url: `/api/automations/${automationId}/${automationRev}`,
    })
  },

  /**
   * Get the logs for the app, or by automation ID.
   * @param automationId The ID of the automation to get logs for.
   * @param startDate An ISO date string to state the start of the date range.
   * @param status The status, error or success.
   * @param page The page to retrieve.
   */
  getAutomationLogs: async ({ automationId, startDate, status, page }) => {
    return await API.post({
      url: "/api/automations/logs/search",
      body: {
        automationId,
        startDate,
        status,
        page,
      },
    })
  },

  /**
   * Clears automation log errors (which are creating notification) for
   * automation or the app.
   * @param automationId optional - the ID of the automation to clear errors for.
   * @param appId The app ID to clear errors for.
   */
  clearAutomationLogErrors: async ({ automationId, appId }) => {
    return await API.delete({
      url: "/api/automations/logs",
      body: {
        appId,
        automationId,
      },
    })
  },
})
