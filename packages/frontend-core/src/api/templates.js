export const buildTemplateEndpoints = API => ({
  /**
   * Gets the list of email template definitions.
   */
  getEmailTemplateDefinitions: async () => {
    return await API.get({ url: "/api/global/template/definitions" })
  },

  /**
   * Gets the list of email templates.
   */
  getEmailTemplates: async () => {
    return await API.get({ url: "/api/global/template/email" })
  },

  /**
   * Saves an email template.
   * @param template the template to save
   */
  saveEmailTemplate: async template => {
    return await API.post({
      url: "/api/global/template",
      body: template,
    })
  },

  /**
   * Gets a list of app templates.
   */
  getAppTemplates: async () => {
    return await API.get({
      url: "/api/templates",
    })
  },
})
