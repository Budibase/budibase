export const buildAutomationEndpoints = API => ({
  /**
   * Executes an automation. Must have "App Action" trigger.
   * @param automationId the ID of the automation to trigger
   * @param fields the fields to trigger the automation with
   */
  triggerAutomation: async ({ automationId, fields }) => {
    return await API.post({
      url: `/api/automations/${automationId}/trigger`,
      body: { fields },
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
})
