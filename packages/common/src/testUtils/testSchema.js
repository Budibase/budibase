import { newModel } from "../schema/models"
import { newView } from "../schema/views"
import { fullSchema } from "../schema/fullSchema"
import { newField, schemaToFields, fieldsToSchema } from "../schema/types"

export function testSchema() {
  const addFieldToModel = (model, field) => {
    const defaultField = newField(field.name, field.type || "text")
    Object.assign(defaultField, field)
    const currentFields = schemaToFields(model.schema)
    model.schema = fieldsToSchema([...currentFields, field])
  }

  const contactModel = newModel()
  contactModel.name = "Contact"
  addFieldToModel(contactModel, { name: "Is Active", type: "boolean" })
  addFieldToModel(contactModel, { name: "Created", type: "datetime" })
  addFieldToModel(contactModel, {
    name: "Status",
    type: "select",
    enum: ["new", "complete"],
  })

  const activeContactsView = newView(contactModel.id)
  activeContactsView.name = "Active Contacts"
  activeContactsView.map = "if (doc['Is Active']) emit(doc.Name, doc)"

  const dealModel = newModel()
  dealModel.name = "Deal"
  addFieldToModel(dealModel, { name: "Estimated Value", type: "number" })
  addFieldToModel(dealModel, {
    name: "Contact",
    type: "link",
    modelId: contactModel.id,
  })

  return fullSchema([contactModel, dealModel], [activeContactsView])
}
