import { getMemoryTemplateApi } from "./specHelpers"
import { diffHierarchy, HierarchyChangeTypes } from "../src/templateApi/diffHierarchy"
import { getFlattenedHierarchy } from "../src/templateApi/hierarchy"

describe("diffHierarchy", () => {

  it("should not show any changes, when hierarchy is unchanged", async () => {
    const oldHierarchy = (await setup()).root;
    const newHierarchy = (await setup()).root;
    const diff = diffHierarchy(oldHierarchy, newHierarchy)
    expect(diff).toEqual([])
  })

  it("should detect root record created", async () => {
    const oldHierarchy = (await setup()).root;
    const newSetup = (await setup());
    const opportunity = newSetup.templateApi.getNewRecordTemplate(newSetup.root, "opportunity", false)
    const diff = diffHierarchy(oldHierarchy, newSetup.root)
    expect(diff).toEqual([{
      newNode: opportunity,
      oldNode: null,
      type: HierarchyChangeTypes.recordCreated
    }])
  })

  it("should only detect root record, when newly created root record has children ", async () => {
    const oldHierarchy = (await setup()).root;
    const newSetup = (await setup());
    const opportunity = newSetup.templateApi.getNewRecordTemplate(newSetup.root, "opportunity", false)
    newSetup.templateApi.getNewRecordTemplate(opportunity, "invoice", true)
    const diff = diffHierarchy(oldHierarchy, newSetup.root)
    expect(diff).toEqual([{
      newNode: opportunity,
      oldNode: null,
      type: HierarchyChangeTypes.recordCreated
    }])
  })

  it("should detect child record created", async () => {
    const oldHierarchy = (await setup()).root;
    const newSetup = (await setup());
    const opportunity = newSetup.templateApi.getNewRecordTemplate(newSetup.contact, "opportunity", false)
    const diff = diffHierarchy(oldHierarchy, newSetup.root)
    expect(diff).toEqual([{
      newNode: opportunity,
      oldNode: null,
      type: HierarchyChangeTypes.recordCreated
    }])
  })

  it("should detect root record deleted", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    newSetup.root.children = newSetup.root.children.filter(n => n.name !== "contact")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: null,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordDeleted
    }])
  })

  it("should detect child record deleted", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    newSetup.contact.children = newSetup.contact.children.filter(n => n.name !== "deal")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: null,
      oldNode: oldSetup.deal,
      type: HierarchyChangeTypes.recordDeleted
    }])
  })

  it("should detect root record renamed", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    newSetup.contact.collectionKey = "CONTACTS"
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.contact,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordRenamed
    }])
  })

  it("should detect child record renamed", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    newSetup.deal.collectionKey = "CONTACTS"
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.deal,
      oldNode: oldSetup.deal,
      type: HierarchyChangeTypes.recordRenamed
    }])
  })

  it("should detect root record field removed", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    newSetup.contact.fields =  newSetup.contact.fields.filter(f => f.name !== "name")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.contact,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordFieldsChanged
    }])
  })

  it("should detect child record field removed", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    newSetup.deal.fields =  newSetup.deal.fields.filter(f => f.name !== "name")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.deal,
      oldNode: oldSetup.deal,
      type: HierarchyChangeTypes.recordFieldsChanged
    }])
  })
  
  it("should detect record field added", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    const notesField = newSetup.templateApi.getNewField("string")
    notesField.name = "notes"
    newSetup.templateApi.addField(newSetup.contact, notesField)

    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.contact,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordFieldsChanged
    }])
  })

  it("should detect 1 record field added and 1 removed (total no. fields unchanged)", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    const notesField = newSetup.templateApi.getNewField("string")
    notesField.name = "notes"
    newSetup.templateApi.addField(newSetup.contact, notesField)
    newSetup.contact.fields =  newSetup.contact.fields.filter(f => f.name !== "name")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.contact,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordFieldsChanged
    }])
  })

  it("should detect root record estimated record count changed", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    newSetup.contact.estimatedRecordCount =  987
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.contact,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordEstimatedRecordTypeChanged
    }])
  })

  it("should detect root record estimated record count changed", async () => {
    const oldSetup = (await setup());
    const newSetup = (await setup());
    newSetup.deal.estimatedRecordCount =  987
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.deal,
      oldNode: oldSetup.deal,
      type: HierarchyChangeTypes.recordEstimatedRecordTypeChanged
    }])
  })

  it("should detect root record created", async () => {
    const oldHierarchy = (await setup()).root;
    const newSetup = (await setup());
    const opportunity = newSetup.templateApi.getNewRecordTemplate(newSetup.root, "opportunity", false)
    const diff = diffHierarchy(oldHierarchy, newSetup.root)
    expect(diff).toEqual([{
      newNode: opportunity,
      oldNode: null,
      type: HierarchyChangeTypes.recordCreated
    }])
  })

})

const setup = async () => {
  const { templateApi } = await getMemoryTemplateApi()
  const root = templateApi.getNewRootLevel()
  const contact = templateApi.getNewRecordTemplate(root, "contact", true)

  const nameField = templateApi.getNewField("string")
  nameField.name = "name"
  const statusField = templateApi.getNewField("string")
  statusField.name = "status"

  templateApi.addField(contact, nameField)
  templateApi.addField(contact, statusField)

  const lead = templateApi.getNewRecordTemplate(root, "lead", true)
  const deal = templateApi.getNewRecordTemplate(contact, "deal", true)

  templateApi.addField(deal, {...nameField})
  templateApi.addField(deal, {...statusField})

  getFlattenedHierarchy(root)
  return {
    root, contact, lead, deal, templateApi,
    all_contacts: root.indexes[0],
    all_leads: root.indexes[1],
    deals_for_contacts: contact.indexes[0]
  }
}