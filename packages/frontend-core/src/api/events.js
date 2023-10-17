export const buildEventEndpoints = API => ({
  /**
   * Publish a specific event to the backend.
   */
  publishEvent: async eventType => {
    return await API.post({
      url: `/api/global/event/publish`,
      body: {
        type: eventType,
      },
    })
  },
})
