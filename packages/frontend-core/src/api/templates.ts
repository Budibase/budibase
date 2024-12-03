import { Template } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface TemplateEndpoints {
  getEmailTemplates: () => Promise<Template[]>

  // Missing request or response types
  getEmailTemplateDefinitions: () => Promise<any>
  saveEmailTemplate: (templaet: any) => Promise<any>
  getAppTemplates: () => Promise<any>
}

export const buildTemplateEndpoints = (
  API: BaseAPIClient
): TemplateEndpoints => ({
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
    const res = await API.get<Template | Template[]>({
      url: "/api/global/template/email",
    })
    return Array.isArray(res) ? res : [res]
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
