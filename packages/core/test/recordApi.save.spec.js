import {
  setupApphierarchy,
  basicAppHierarchyCreator_WithFields,
  stubEventHandler,
} from "./specHelpers"
import { events, isNonEmptyString } from "../src/common"
import { permission } from "../src/authApi/permissions"
import { getRecordInfo } from "../src/recordApi/recordInfo"

describe("recordApi > save then load", () => {
  it("should save all field values on create new record", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")

    record.surname = "Ledog"
    record.isalive = true
    record.age = 9
    record.createddate = new Date()

    await recordApi.save(record)

    const saved = await recordApi.load(record.key)

    expect(saved.surname).toBe(record.surname)
    expect(saved.isalive).toBe(record.isalive)
    expect(saved.age).toBe(record.age)
    expect(saved.createddate).toEqual(record.createddate)
  })

  it("should create values for fields when undefined", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")

    record.age = 9
    record.createddate = new Date()

    await recordApi.save(record)

    const saved = await recordApi.load(record.key)

    expect(saved.surname).toBe(null)
    expect(saved.isalive).toBe(true)
    expect(saved.age).toBe(record.age)
    expect(saved.createddate).toEqual(record.createddate)
  })

  it("loaded record isNew() always return false", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")

    record.age = 9
    record.createddate = new Date()

    await recordApi.save(record)

    const saved = await recordApi.load(record.key)

    expect(saved.isNew).toBeDefined()
    expect(saved.isNew).toBe(false)
  })

  it("loaded record id() and key() should work", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")

    record.age = 9
    record.createddate = new Date()

    await recordApi.save(record)

    const saved = await recordApi.load(record.key)

    expect(saved.id).toBeDefined()
    expect(saved.id).toBe(record.id)

    expect(saved.key).toBeDefined()
    expect(saved.key).toBe(saved.key)
  })

  it("loaded record type() should be a function", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")

    record.age = 9
    record.createddate = new Date()

    await recordApi.save(record)

    const saved = await recordApi.load(record.key)

    expect(isNonEmptyString(saved.type)).toBeTruthy()
    expect(saved.type).toBe("customer")
  })

  it("update existing should update field", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")

    record.surname = "Ledog"
    record.isalive = true
    record.age = 9
    record.createddate = new Date()

    await recordApi.save(record)

    const saved = await recordApi.load(record.key)

    saved.surname = "Zeedog"
    await recordApi.save(saved)
    const savedAgain = await recordApi.load(saved.key)
    expect(savedAgain.surname).toBe(saved.surname)
  })

  it("should maintain referential integrity", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    const referredByCustomer = recordApi.getNew("/customers", "customer")
    referredByCustomer.surname = "Ledog"
    referredByCustomer.age = 9
    ;(referredByCustomer.isalive = true),
      (referredByCustomer.createdDate = new Date())
    const savedReferredBy = await recordApi.save(referredByCustomer)

    const referredCustomer = recordApi.getNew("/customers", "customer")
    referredCustomer.surname = "Zeecat"
    referredCustomer.age = 9
    ;(referredCustomer.isalive = true),
      (referredCustomer.createdDate = new Date())
    referredCustomer.referredBy = referredByCustomer
    await recordApi.save(referredCustomer)

    savedReferredBy.surname = "Zeedog"
    await recordApi.save(savedReferredBy)

    const loadedReferredTo = await recordApi.load(referredCustomer.key)
    expect(loadedReferredTo.referredBy.surname).toBe("Zeedog")
  })
})

describe("save", () => {
  it("IsNew() should return false after save", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    record.surname = "Ledog"

    const savedRecord = await recordApi.save(record)
    expect(savedRecord.isNew).toBe(false)
  })

  it("should publish onbegin and oncomplete events", async () => {
    const { recordApi, subscribe } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const handler = stubEventHandler()
    subscribe(events.recordApi.save.onBegin, handler.handle)
    subscribe(events.recordApi.save.onComplete, handler.handle)

    const record = recordApi.getNew("/customers", "customer")
    record.surname = "Ledog"

    await recordApi.save(record)

    const onBegin = handler.getEvents(events.recordApi.save.onBegin)
    const onComplete = handler.getEvents(events.recordApi.save.onComplete)
    expect(onBegin.length).toBe(1)
    expect(onComplete.length).toBe(1)
    expect(onBegin[0].context.record).toBeDefined()
    expect(onBegin[0].context.record.key).toBe(record.key)
    expect(onComplete[0].context.record).toBeDefined()
    expect(onComplete[0].context.record.key).toBe(record.key)
  })

  it("should publish create on create and update on update", async () => {
    const { recordApi, subscribe } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const handler = stubEventHandler()
    subscribe(events.recordApi.save.onRecordCreated, handler.handle)
    subscribe(events.recordApi.save.onRecordUpdated, handler.handle)

    const record = recordApi.getNew("/customers", "customer")
    record.surname = "Ledog"

    const savedRecord = await recordApi.save(record)
    const onCreate = handler.getEvents(events.recordApi.save.onRecordCreated)
    expect(onCreate.length).toBe(1)
    expect(onCreate[0].context.record).toBeDefined()
    expect(onCreate[0].context.record.key).toBe(record.key)

    savedRecord.surname = "Zeecat"
    await recordApi.save(savedRecord)

    const onUpdate = handler.getEvents(events.recordApi.save.onRecordUpdated)
    expect(onUpdate.length).toBe(1)
    expect(onUpdate[0].context.old).toBeDefined()
    expect(onUpdate[0].context.old.key).toBe(record.key)
    expect(onUpdate[0].context.old.surname).toBe("Ledog")
    expect(onUpdate[0].context.new).toBeDefined()
    expect(onUpdate[0].context.new.key).toBe(record.key)
    expect(onUpdate[0].context.new.surname).toBe("Zeecat")
  })

  it("should create folder and index for subcollection", async () => {
    const { recordApi, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    record.surname = "Ledog"

    await recordApi.save(record)
    const recordDir = getRecordInfo(appHierarchy.root, record.key).dir
    expect(
      await recordApi._storeHandle.exists(
        `${recordDir}/invoice_index/index.csv`
      )
    ).toBeTruthy()
    expect(
      await recordApi._storeHandle.exists(`${recordDir}/invoice_index`)
    ).toBeTruthy()
    expect(
      await recordApi._storeHandle.exists(`${recordDir}/invoices`)
    ).toBeTruthy()
  })

  it("should create index folder and shardMap for sharded reverse reference index", async () => {
    const { recordApi, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    record.surname = "Ledog"

    await recordApi.save(record)
    const recordDir = getRecordInfo(appHierarchy.root, record.key).dir
    expect(
      await recordApi._storeHandle.exists(
        `${recordDir}/referredToCustomers/shardMap.json`
      )
    ).toBeTruthy()
    expect(
      await recordApi._storeHandle.exists(`${recordDir}/referredToCustomers`)
    ).toBeTruthy()
  })

  it("should create folder for record", async () => {
    const { recordApi, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    record.surname = "Ledog"

    await recordApi.save(record)
    const recordDir = getRecordInfo(appHierarchy.root, record.key).dir

    expect(await recordApi._storeHandle.exists(`${recordDir}`)).toBeTruthy()
    expect(
      await recordApi._storeHandle.exists(`${recordDir}/record.json`)
    ).toBeTruthy()
  })

  it("create should throw error, user user does not have permission", async () => {
    const { recordApi, app, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    app.removePermission(
      permission.createRecord.get(appHierarchy.customerRecord.nodeKey())
    )
    expect(recordApi.save(record)).rejects.toThrow(/Unauthorized/)
  })

  it("create should not depend on having any other permissions", async () => {
    const { recordApi, app, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    app.withOnlyThisPermission(
      permission.createRecord.get(appHierarchy.customerRecord.nodeKey())
    )
    const record = recordApi.getNew("/customers", "customer")
    await recordApi.save(record)
  })

  it("update should throw error, user user does not have permission", async () => {
    const { recordApi, app, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    app.removePermission(
      permission.updateRecord.get(appHierarchy.customerRecord.nodeKey())
    )
    const created = await recordApi.save(record)
    expect(recordApi.save(created)).rejects.toThrow(/Unauthorized/)
  })

  it("update should not depend on having any other permissions", async () => {
    const { recordApi, app, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    const saved = await recordApi.save(record)
    app.withOnlyThisPermission(
      permission.updateRecord.get(appHierarchy.customerRecord.nodeKey())
    )
    await recordApi.save(saved)
  })
})

describe("recordApi > load", () => {
  it("should throw error when user user does not have permission", async () => {
    const { recordApi, app, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    const created = await recordApi.save(record)
    app.removePermission(
      permission.readRecord.get(appHierarchy.customerRecord.nodeKey())
    )
    expect(recordApi.load(created.key)).rejects.toThrow(/Unauthorized/)
  })

  it("should not depend on having any other permissions", async () => {
    const { recordApi, app, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    const saved = await recordApi.save(record)
    app.withOnlyThisPermission(
      permission.readRecord.get(appHierarchy.customerRecord.nodeKey())
    )
    await recordApi.load(saved.key)
  })
})
