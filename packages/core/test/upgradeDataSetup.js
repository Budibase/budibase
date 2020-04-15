import { getMemoryTemplateApi, appFromTempalteApi } from "./specHelpers"
import { getFlattenedHierarchy } from "../src/templateApi/hierarchy"
import { initialiseData } from "../src/appInitialise/initialiseData"

export const setup = async store => {
  const { templateApi } = await getMemoryTemplateApi(store)
  const root = templateApi.getNewRootLevel()
  const contact = templateApi.getNewModelTemplate(root, "contact", true)
  contact.collectionName = "contacts"

  const nameField = templateApi.getNewField("string")
  nameField.name = "name"
  const statusField = templateApi.getNewField("string")
  statusField.name = "status"

  templateApi.addField(contact, nameField)
  templateApi.addField(contact, statusField)

  const lead = templateApi.getNewModelTemplate(root, "lead", true)
  lead.collectionName = "leads"
  const deal = templateApi.getNewModelTemplate(contact, "deal", true)
  deal.collectionName = "deals"

  templateApi.addField(deal, { ...nameField })
  templateApi.addField(deal, { ...statusField })

  templateApi.addField(lead, { ...nameField })

  getFlattenedHierarchy(root)

  if (!store)
    await initialiseData(templateApi._storeHandle, {
      hierarchy: root,
      actions: [],
      triggers: [],
    })
  const app = await appFromTempalteApi(templateApi)
  app.hierarchy = root

  return {
    root,
    contact,
    lead,
    app,
    deal,
    templateApi,
    store: templateApi._storeHandle,
    all_contacts: root.indexes[0],
    all_leads: root.indexes[1],
    deals_for_contacts: contact.indexes[0],
  }
}
