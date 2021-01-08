import API from "./api"
/**
 * Executes an automation. Must have "App Action" trigger.
 */
export const triggerAutomation = async (automationId, fields) => {
  return await API.post({
    url: `/api/automations/${automationId}/trigger`,
    body: { fields },
  })
}
