import { generateSchema } from "../src/indexing/indexSchemaCreator"
import { setupApphierarchy } from "./specHelpers"
import { find } from "lodash"
import { indexTypes } from "../src/templateApi/indexes"

describe("indexSchemGenerator", () => {
  it("should return mapped columns of single type, when accepts all in collection of one type", async () => {
    const { appHierarchy } = await setup(false)
    const schema = generateSchema(appHierarchy.root, appHierarchy.petsIndex)
    schemaHasFieldOfType(schema, "key", "string")
    schemaHasFieldOfType(schema, "sortKey", "string")
    schemaHasFieldOfType(schema, "id", "string")
    schemaHasFieldOfType(schema, "type", "string")
    schemaHasFieldOfType(schema, "isNew", "bool")
    schemaHasFieldOfType(schema, "name", "string")
    schemaHasFieldOfType(schema, "dob", "datetime")
    schemaHasFieldOfType(schema, "isAlive", "bool")
    expect(schema.length).toBe(8)
  })

  it("should return mapped columns of two types, when accepts all in collection or two typs", async () => {
    const { appHierarchy } = await setup(true)
    const schema = generateSchema(appHierarchy.root, appHierarchy.petsIndex)
    schemaHasFieldOfType(schema, "key", "string")
    schemaHasFieldOfType(schema, "sortKey", "string")
    schemaHasFieldOfType(schema, "id", "string")
    schemaHasFieldOfType(schema, "type", "string")
    schemaHasFieldOfType(schema, "isNew", "bool")
    schemaHasFieldOfType(schema, "name", "string")
    schemaHasFieldOfType(schema, "dob", "datetime")
    schemaHasFieldOfType(schema, "isAlive", "bool")
    schemaHasFieldOfType(schema, "noOfGills", "number")
    schemaHasFieldOfType(schema, "favouriteFish", "reference")
    expect(schema.length).toBe(10)
  })

  it("should return mapped columns of one types, when accepts only onw of two types", async () => {
    const { appHierarchy } = await setup(true)
    const schema = generateSchema(appHierarchy.root, appHierarchy.fishOnlyIndex)
    schemaHasFieldOfType(schema, "key", "string")
    schemaHasFieldOfType(schema, "sortKey", "string")
    schemaHasFieldOfType(schema, "id", "string")
    schemaHasFieldOfType(schema, "type", "string")
    schemaHasFieldOfType(schema, "isNew", "bool")
    schemaHasFieldOfType(schema, "name", "string")
    schemaHasFieldOfType(schema, "isAlive", "bool")
    schemaHasFieldOfType(schema, "noOfGills", "number")
    expect(schema.length).toBe(8)
  })

  it("should return mapped columns type, for reverse reference index", async () => {
    const { appHierarchy } = await setup(true)
    const schema = generateSchema(appHierarchy.root, appHierarchy.dogFriends)
    schemaHasFieldOfType(schema, "key", "string")
    schemaHasFieldOfType(schema, "sortKey", "string")
    schemaHasFieldOfType(schema, "id", "string")
    schemaHasFieldOfType(schema, "type", "string")
    schemaHasFieldOfType(schema, "isNew", "bool")
    schemaHasFieldOfType(schema, "name", "string")
    schemaHasFieldOfType(schema, "isAlive", "bool")
    schemaHasFieldOfType(schema, "dob", "datetime")
    schemaHasFieldOfType(schema, "favouriteFish", "reference")
    expect(schema.length).toBe(9)
  })
})

const schemaHasFieldOfType = (schema, fieldname, type) => {
  const field = find(schema, f => f.name === fieldname)
  const fname = !field ? "field not found" : field.name
  expect(fname).toBe(fieldname)
  expect(field.type).toBe(type)
}

const setup = includeFish => setupApphierarchy(createApp(includeFish))

const createApp = includeFish => templateApi => {
  const root = templateApi.getNewRootLevel()

  const dogRecord = templateApi.getNewRecordTemplate(root, "dog")

  const addField = recordNode => (name, type, typeOptions) => {
    const field = templateApi.getNewField(type)
    field.name = name
    if (typeOptions) field.typeOptions = typeOptions
    templateApi.addField(recordNode, field)
    return field
  }

  const petsIndex = templateApi.getNewIndexTemplate(root)
  petsIndex.name = "allPets"
  petsIndex.allowedRecordNodeIds = [dogRecord.nodeId]

  const addDogField = addField(dogRecord)
  addDogField("name", "string")
  addDogField("dob", "datetime")
  addDogField("isAlive", "bool")

  let fishStuff = {}
  if (includeFish) {
    const fishRecord = templateApi.getNewRecordTemplate(root, "fish")
    const addFishField = addField(fishRecord)
    addFishField("name", "string")
    addFishField("isAlive", "bool")
    addFishField("noOfGills", "number")
    fishStuff.fishRecord = fishRecord
    const fishOnlyIndex = templateApi.getNewIndexTemplate(root)
    fishOnlyIndex.name = "fishOnly"
    fishOnlyIndex.allowedRecordNodeIds = [fishRecord.nodeId]
    fishStuff.fishOnlyIndex = fishOnlyIndex

    const dogFriends = templateApi.getNewIndexTemplate(
      dogRecord,
      indexTypes.reference
    )
    dogFriends.name = "dogFriends"
    fishStuff.dogFriends = dogFriends

    petsIndex.allowedRecordNodeIds.push(fishRecord.nodeId)

    const favFishField = addDogField("favouriteFish", "reference", {
      indexNodeKey: fishOnlyIndex.nodeKey(),
      reverseIndexNodeKeys: [dogFriends.nodeKey()],
      displayValue: "name",
    })
    fishStuff.favFishField = favFishField
  }

  return {
    dogRecord,
    petsIndex,
    root,
    ...fishStuff,
  }
}
