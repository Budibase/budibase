import { newModel } from "../src/schema/models"
import { newView } from "../src/schema/views"
import { getNewField } from "../src/schema/fields"
import { fullSchema } from "../src/schema/fullSchema"
import { commonRecordValidationRules } from "../src/records/recordValidationRules"

export function testSchema() {
  const addFieldToModel = (model, { type, name }) => {
    const field = getNewField(type || "string")
    field.name = name
    model.fields.push(field)
  }

  const contactModel = newModel()
  contactModel.name = "Contact"
  contactModel.primaryField = "Name"

  addFieldToModel(contactModel, { name: "Name" })
  addFieldToModel(contactModel, { name: "Is Active", type: "bool" })
  addFieldToModel(contactModel, { name: "Created", type: "datetime" })
  addFieldToModel(contactModel, { name: "Status", type: "string" })

  contactModel.validationRules.push(
    commonRecordValidationRules.fieldNotEmpty("Name")
  )

  const activeContactsView = newView(contactModel.id)
  activeContactsView.name = "Active Contacts"
  activeContactsView.map = "if (doc['Is Active']) emit(doc.Name, doc)"

  const dealModel = newModel()
  dealModel.name = "Deal"
  addFieldToModel(dealModel, { name: "Name" })
  addFieldToModel(dealModel, { name: "Estimated Value", type: "number" })
  addFieldToModel(dealModel, { name: "Contact", type: "link" })

  return fullSchema([contactModel, dealModel], [activeContactsView])
}
