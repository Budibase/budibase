import { setup } from "./upgradeDataSetup"
import { diffHierarchy, HierarchyChangeTypes } from "../src/templateApi/diffHierarchy"

describe("diffHierarchy", () => {

  it("should not show any changes, when hierarchy is unchanged", async () => {
    const oldHierarchy = (await setup()).root;
    const newHierarchy = (await setup()).root;
    const diff = diffHierarchy(oldHierarchy, newHierarchy)
    expect(diff).toEqual([])
  })

  it("should detect root record created", async () => {
    const oldHierarchy = (await setup()).root;
    const newSetup = await setup()
    const opportunity = newSetup.templateApi.getNewModelTemplate(newSetup.root, "opportunity", false)
    const diff = diffHierarchy(oldHierarchy, newSetup.root)
    expect(diff).toEqual([{
      newNode: opportunity,
      oldNode: null,
      type: HierarchyChangeTypes.recordCreated
    }])
  })

  it("should only detect root record, when newly created root record has children ", async () => {
    const oldHierarchy = (await setup()).root;
    const newSetup = await setup()
    const opportunity = newSetup.templateApi.getNewModelTemplate(newSetup.root, "opportunity", false)
    newSetup.templateApi.getNewModelTemplate(opportunity, "invoice", true)
    const diff = diffHierarchy(oldHierarchy, newSetup.root)
    expect(diff).toEqual([{
      newNode: opportunity,
      oldNode: null,
      type: HierarchyChangeTypes.recordCreated
    }])
  })

  it("should detect child record created", async () => {
    const oldHierarchy = (await setup()).root;
    const newSetup = await setup()
    const opportunity = newSetup.templateApi.getNewModelTemplate(newSetup.contact, "opportunity", false)
    const diff = diffHierarchy(oldHierarchy, newSetup.root)
    expect(diff).toEqual([{
      newNode: opportunity,
      oldNode: null,
      type: HierarchyChangeTypes.recordCreated
    }])
  })

  it("should detect root record deleted", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.root.children = newSetup.root.children.filter(n => n.name !== "contact")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: null,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordDeleted
    }])
  })

  it("should detect child record deleted", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.contact.children = newSetup.contact.children.filter(n => n.name !== "deal")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: null,
      oldNode: oldSetup.deal,
      type: HierarchyChangeTypes.recordDeleted
    }])
  })

  it("should detect root record renamed", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.contact.collectionKey = "CONTACTS"
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.contact,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordRenamed
    }])
  })

  it("should detect child record renamed", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.deal.collectionKey = "CONTACTS"
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.deal,
      oldNode: oldSetup.deal,
      type: HierarchyChangeTypes.recordRenamed
    }])
  })

  it("should detect root record field removed", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.contact.fields = newSetup.contact.fields.filter(f => f.name !== "name")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.contact,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordFieldsChanged
    }])
  })

  it("should detect child record field removed", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.deal.fields = newSetup.deal.fields.filter(f => f.name !== "name")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.deal,
      oldNode: oldSetup.deal,
      type: HierarchyChangeTypes.recordFieldsChanged
    }])
  })

  it("should detect record field added", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
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
    const oldSetup = await setup()
    const newSetup = await setup()
    const notesField = newSetup.templateApi.getNewField("string")
    notesField.name = "notes"
    newSetup.templateApi.addField(newSetup.contact, notesField)
    newSetup.contact.fields = newSetup.contact.fields.filter(f => f.name !== "name")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.contact,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordFieldsChanged
    }])
  })

  it("should detect root record estimated record count changed", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.contact.estimatedRecordCount = 987
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.contact,
      oldNode: oldSetup.contact,
      type: HierarchyChangeTypes.recordEstimatedRecordTypeChanged
    }])
  })

  it("should detect root record estimated record count changed", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.deal.estimatedRecordCount = 987
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup.deal,
      oldNode: oldSetup.deal,
      type: HierarchyChangeTypes.recordEstimatedRecordTypeChanged
    }])
  })

  it("should detect root index created", async () => {
    const oldHierarchy = (await setup()).root
    const newSetup = await setup()
    const all_deals = newSetup.templateApi.getNewIndexTemplate(newSetup.root)
    const diff = diffHierarchy(oldHierarchy, newSetup.root)
    expect(diff).toEqual([{
      newNode: all_deals,
      oldNode: null,
      type: HierarchyChangeTypes.indexCreated
    }])
  })

  it("should detect child index created", async () => {
    const oldHierarchy = (await setup()).root
    const newSetup = await setup()
    const all_deals = newSetup.templateApi.getNewIndexTemplate(newSetup.contact)
    const diff = diffHierarchy(oldHierarchy, newSetup.root)
    expect(diff).toEqual([{
      newNode: all_deals,
      oldNode: null,
      type: HierarchyChangeTypes.indexCreated
    }])
  })

  it("should detect root index deleted", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.root.indexes = newSetup.root.indexes.filter(i => i.name !== "contact_index")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: null,
      oldNode: oldSetup.root.indexes.find(i => i.name === "contact_index"),
      type: HierarchyChangeTypes.indexDeleted
    }])
  })

  it("should detect child index deleted", async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    newSetup.contact.indexes = newSetup.contact.indexes.filter(i => i.name !== "deal_index")
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: null,
      oldNode: oldSetup.contact.indexes.find(i => i.name === "deal_index"),
      type: HierarchyChangeTypes.indexDeleted
    }])
  })

  const testIndexChanged = (parent, makechange) => async () => {
    const oldSetup = await setup()
    const newSetup = await setup()
    makechange(newSetup)
    const diff = diffHierarchy(oldSetup.root, newSetup.root)
    expect(diff).toEqual([{
      newNode: newSetup[parent].indexes[0],
      oldNode: oldSetup[parent].indexes[0],
      type: HierarchyChangeTypes.indexChanged
    }])
  }

  it("should detect root index map changed", testIndexChanged("root", newSetup => {
    newSetup.root.indexes[0].map = "new"
  }))

  it("should detect root index filter changed", testIndexChanged("root", newSetup => {
    newSetup.root.indexes[0].filter = "new"
  }))

  it("should detect root index shardName changed", testIndexChanged("root", newSetup => {
    newSetup.root.indexes[0].getShardName = "new"
  }))

  it("should detect root index allowedRecordIds changed", testIndexChanged("root", newSetup => {
    newSetup.root.indexes[0].allowedModelNodeIds.push(3)
  }))

  it("should detect child index allowedRecordIds changed", testIndexChanged("contact", newSetup => {
    newSetup.contact.indexes[0].allowedModelNodeIds.push(3)
  }))

  it("should detect child index map changed", testIndexChanged("contact", newSetup => {
    newSetup.contact.indexes[0].map = "new"
  }))

  it("should detect child index filter changed", testIndexChanged("contact", newSetup => {
    newSetup.contact.indexes[0].filter = "new"
  }))

  it("should detect child index shardName changed", testIndexChanged("contact", newSetup => {
    newSetup.contact.indexes[0].getShardName = "new"
  }))

})

