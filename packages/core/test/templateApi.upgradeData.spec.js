import { 
  getRecordApiFromTemplateApi,
  getIndexApiFromTemplateApi,
} from "./specHelpers"
import { upgradeData } from "../src/templateApi/upgradeData"
import { setup } from "./upgradeDataSetup"
import { $, splitKey } from "../src/common"
import { keys, filter } from "lodash/fp"
import { _listItems } from "../src/indexApi/listItems"
import { _save } from "../src/recordApi/save"

describe("upgradeData", () => {

  it("should delete all records and child records, when root record node deleted", async () => {
    const { oldSetup, newSetup, recordApi } = await configure()
    newSetup.root.children = newSetup.root.children.filter(n => n.name !== "contact")

    await upgradeData(oldSetup.app)(newSetup.root)

    const remainingKeys = $(recordApi._storeHandle.data, [
      keys,
      filter(k => splitKey(k)[0] === "contacts"),
    ])

    expect(remainingKeys.length).toBe(0)
    
  })

  it("should not delete other root record types, when root record node deleted", async () => {
    const { oldSetup, newSetup, recordApi } = await configure()
    newSetup.root.children = newSetup.root.children.filter(n => n.name !== "contact")

    await upgradeData(oldSetup.app)(newSetup.root)

    const remainingKeys = $(recordApi._storeHandle.data, [
      keys,
      filter(k => splitKey(k)[0] === "leads"),
    ])

    expect(remainingKeys.length > 0).toBe(true)
    
  })

  it("should delete all child records, when child record node deleted", async () => {
    const { oldSetup, newSetup, recordApi } = await configure()
    newSetup.contact.children = newSetup.contact.children.filter(n => n.name !== "deal")

    const startingKeys = $(recordApi._storeHandle.data, [
      keys,
      filter(k => k.includes("/deals/")),
    ])

    expect(startingKeys.length > 0).toBe(true)

    await upgradeData(oldSetup.app)(newSetup.root)

    const remainingKeys = $(recordApi._storeHandle.data, [
      keys,
      filter(k => k.includes("/deals/")),
    ])

    expect(remainingKeys.length).toBe(0)
  })

  it("should build a new root index", async () => {
    const { oldSetup, newSetup } = await configure()
    const newIndex = newSetup.templateApi.getNewIndexTemplate(newSetup.root)
    newIndex.name = "more_contacts"
    newIndex.allowedRecordNodeIds = [newSetup.contact.nodeId]

    await upgradeData(oldSetup.app)(newSetup.root)

    const itemsInNewIndex = await _listItems(newSetup.app, "/more_contacts")

    expect(itemsInNewIndex.length).toBe(2)
  })

  it("should update a root index", async () => {
    const { oldSetup, newSetup } = await configure()
    const contact_index = indexByName(newSetup.root, "contact_index")
    contact_index.filter = "record.name === 'bobby'"

    await upgradeData(oldSetup.app)(newSetup.root)

    const itemsInNewIndex = await _listItems(newSetup.app, "/contact_index")

    expect(itemsInNewIndex.length).toBe(1)
  })

  it("should delete a root index", async () => {
    const { oldSetup, newSetup } = await configure()

    // no exception
    await _listItems(newSetup.app, "/contact_index")

    newSetup.root.indexes = newSetup.root.indexes.filter(i => i.name !== "contact_index")

    await upgradeData(oldSetup.app)(newSetup.root)

    let er
    try {
      await _listItems(newSetup.app, "/contact_index")
    } catch (e) {
      er = e
    }

    expect(er).toBeDefined()
  })

  it("should build a new child index", async () => {
    const { oldSetup, newSetup, records } = await configure()
    const newIndex = newSetup.templateApi.getNewIndexTemplate(newSetup.contact)
    newIndex.name = "more_deals"
    newIndex.allowedRecordNodeIds = [newSetup.deal.nodeId]

    await upgradeData(oldSetup.app)(newSetup.root)

    const itemsInNewIndex = await _listItems(newSetup.app, `${records.contact1.key}/more_deals`)

    expect(itemsInNewIndex.length).toBe(2)
  })

  it("should update a child index", async () => {
    const { oldSetup, newSetup, records } = await configure()
    const deal_index = indexByName(newSetup.contact, "deal_index")
    deal_index.filter = "record.status === 'new'"

    let itemsInIndex = await _listItems(newSetup.app, `${records.contact1.key}/deal_index`)
    expect(itemsInIndex.length).toBe(2)

    await upgradeData(oldSetup.app)(newSetup.root)

    itemsInIndex = await _listItems(newSetup.app, `${records.contact1.key}/deal_index`)
    expect(itemsInIndex.length).toBe(1)
  })

  it("should delete a child index", async () => {
    const { oldSetup, newSetup, records } = await configure()

    // no exception
    await _listItems(newSetup.app, `${records.contact1.key}/deal_index`)

    newSetup.contact.indexes = newSetup.contact.indexes.filter(i => i.name !== "deal_index")

    await upgradeData(oldSetup.app)(newSetup.root)

    let er
    try {
      await _listItems(newSetup.app, `${records.contact1.key}/deal_index`)
    } catch (e) {
      er = e
    }

    expect(er).toBeDefined()
  })

  it("should build a new reference index", async () => {
    const { oldSetup, newSetup, records, recordApi } = await configure()
    const newIndex = newSetup.templateApi.getNewIndexTemplate(newSetup.lead)
    newIndex.name = "contact_leads"
    newIndex.allowedRecordNodeIds = [newSetup.lead.nodeId]
    newIndex.indexType = "reference"

    const leadField = newSetup.templateApi.getNewField("string")
    leadField.name = "lead"
    leadField.type = "reference"
    leadField.typeOptions = {
      reverseIndexNodeKeys: [ newIndex.nodeKey() ],
      indexNodeKey: "/lead_index",
      displayValue: "name"
    }

    newSetup.templateApi.addField(newSetup.contact, leadField)
    
    await upgradeData(oldSetup.app)(newSetup.root)

    const indexKey = `${records.lead1.key}/contact_leads`

    let itemsInNewIndex = await _listItems(newSetup.app, indexKey)

    expect(itemsInNewIndex.length).toBe(0)

    records.contact1.lead = records.lead1
    records.contact1.isNew = false

    await _save(newSetup.app, records.contact1)

    itemsInNewIndex = await _listItems(newSetup.app, indexKey)

    expect(itemsInNewIndex.length).toBe(1)

  })

})

const configure = async () => {
  const oldSetup = await setup()
  
  const recordApi = await getRecordApiFromTemplateApi(oldSetup.templateApi)
  const indexApi = await getIndexApiFromTemplateApi(oldSetup.templateApi)
  
  const newSetup = await setup(oldSetup.store)

  const records = await createSomeRecords(recordApi)

  return { oldSetup, newSetup, recordApi, records, indexApi }
}

const createSomeRecords = async recordApi => {
  const contact1 = recordApi.getNew("/contacts", "contact")
  contact1.name = "bobby"
  const contact2 = recordApi.getNew("/contacts", "contact")
  contact2.name = "poppy"

  await recordApi.save(contact1)
  await recordApi.save(contact2)

  const deal1 = recordApi.getNew(`${contact1.key}/deals`, "deal")
  deal1.name = "big mad deal"
  deal1.status = "new"
  const deal2 = recordApi.getNew(`${contact1.key}/deals`, "deal")
  deal2.name = "smaller deal"
  deal2.status = "old"
  const deal3 = recordApi.getNew(`${contact2.key}/deals`, "deal")
  deal3.name = "ok deal"
  deal3.status = "new"

  await recordApi.save(deal1)
  await recordApi.save(deal2)
  await recordApi.save(deal3)

  const lead1 = recordApi.getNew("/leads", "lead")
  lead1.name = "big new lead"

  await recordApi.save(lead1)



  return {
    contact1, contact2, deal1, deal2, deal3, lead1,
  }
}

const indexByName = (parent, name) => parent.indexes.find(i => i.name === name)