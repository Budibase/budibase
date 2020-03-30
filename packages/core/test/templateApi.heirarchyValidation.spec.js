import { validateAll } from "../src/templateApi/validate"
import createNodes from "../src/templateApi/createNodes"
import { some } from "lodash"
import { getNewField, addField } from "../src/templateApi/fields"
import {
  getNewRecordValidationRule,
  commonRecordValidationRules,
  addRecordValidationRule,
} from "../src/templateApi/recordValidationRules"
import { findField } from "../src/templateApi/hierarchy"
import { findCollectionDefaultIndex } from "./specHelpers"

const createValidHierarchy = () => {
  const root = createNodes.getNewRootLevel()

  const customerRecord = createNodes.getNewRecordTemplate(root, "customer")
  customerRecord.collectionName = "customers"

  const customersDefaultIndex = findCollectionDefaultIndex(customerRecord)
  const customersNoGroupaggregateGroup = createNodes.getNewAggregateGroupTemplate(
    customersDefaultIndex
  )
  customersNoGroupaggregateGroup.name = "Customers Summary"
  const allCustomersOwedFunctions = createNodes.getNewAggregateTemplate(
    customersNoGroupaggregateGroup
  )
  allCustomersOwedFunctions.aggregatedValue = "return record.owed"
  allCustomersOwedFunctions.name = "all customers owed amount"

  const partnerRecord = createNodes.getNewRecordTemplate(root, "partner")
  partnerRecord.collectionName = "partners"
  partnerRecord.name = "partner"
  const businessName = getNewField("string")
  businessName.name = "businessname"
  businessName.label = "bn"
  addField(partnerRecord, businessName)

  customerRecord.name = "customer"
  const surnameField = getNewField("string")
  surnameField.name = "surname"
  surnameField.label = "surname"
  const isaliveField = getNewField("bool")
  isaliveField.name = "isalive"
  const createddateField = getNewField("datetime")
  createddateField.name = "createddate"
  const ageField = getNewField("number")
  ageField.name = "age"
  const partnerField = getNewField("reference")
  partnerField.name = "partner"
  partnerField.typeOptions.indexNodeKey = "l"
  partnerField.typeOptions.reverseIndexNodeKeys = ["l"]
  partnerField.typeOptions.displayValue = "l"
  const otherNamesField = getNewField("array<string>")
  otherNamesField.name = "othernames"
  addField(customerRecord, surnameField)
  addField(customerRecord, isaliveField)
  addField(customerRecord, createddateField)
  addField(customerRecord, ageField)
  addField(customerRecord, partnerField)
  addField(customerRecord, otherNamesField)
  addRecordValidationRule(customerRecord)(
    commonRecordValidationRules.fieldNotEmpty("surname")
  )

  return {
    root,
    customerRecord,
    customersDefaultIndex,
    customersNoGroupaggregateGroup,
    allCustomersOwedFunctions,
  }
}

describe("hierarchy validation", () => {
  const expectInvalidField = (
    validationResult,
    fieldName,
    expectedNode,
    count = 1
  ) => {
    expect(validationResult.length).toBe(count)
    expect(
      some(
        validationResult,
        r => r.field === fieldName && r.item === expectedNode
      )
    ).toBe(true)
  }

  it("should return no errors when hierarchy is valid", () => {
    const hierarchy = createValidHierarchy()
    const validationResult = validateAll(hierarchy.root)
    expect(validationResult).toEqual([])
  })

  it("should return an error on name field, when name not set, on all nodes types", () => {
    let hierarchy = createValidHierarchy()
    const expectInvalidName = node =>
      expectInvalidField(validationResult, "name", node, 1)

    hierarchy = createValidHierarchy()
    hierarchy.customerRecord.name = ""
    let validationResult = validateAll(hierarchy.root)
    expectInvalidName(hierarchy.customerRecord)
    hierarchy.customerRecord.name = "customers"

    hierarchy = createValidHierarchy()
    hierarchy.customerRecord.name = ""
    validationResult = validateAll(hierarchy.root)
    expectInvalidName(hierarchy.customerRecord)
    hierarchy.customerRecord.name = "customer"
  })

  it("record > should return an error on fields member if empty", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customerRecord.fields = []
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "fields", hierarchy.customerRecord)
  })

  it("record > should return an error on unrecognised type", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customerRecord.type = "notatype"
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "type", hierarchy.customerRecord)
  })

  it("record > should return an error when validation rules do not have correct members", () => {
    let hierarchy = createValidHierarchy()
    delete hierarchy.customerRecord.validationRules[0].expressionWhenValid
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "validationRules",
      hierarchy.customerRecord
    )

    hierarchy = createValidHierarchy()
    delete hierarchy.customerRecord.validationRules[0].messageWhenInvalid
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "validationRules",
      hierarchy.customerRecord
    )
  })

  it("collection > should return error when duplicate names", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customerRecord.collectionName = "partners"
    hierarchy.customerRecord.name = "partner"
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "name", hierarchy.customerRecord, 2)
  })

  it("index > should return error when index has no map", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customersDefaultIndex.map = ""
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "map", hierarchy.customersDefaultIndex)
  })

  it("index > should return error when index map function does not compile", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customersDefaultIndex.map = "invalid js!!"
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "map", hierarchy.customersDefaultIndex)
  })

  it("index > should return error when index filter function does not compile", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customersDefaultIndex.filter = "invalid js!!"
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "filter",
      hierarchy.customersDefaultIndex
    )
  })

  it("index > should return error when index type is not one of allowed values", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customersDefaultIndex.indexType = ""
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "indexType",
      hierarchy.customersDefaultIndex
    )

    hierarchy.customersDefaultIndex.indexType = "should not be allowed"
    const validationResult2 = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult2,
      "indexType",
      hierarchy.customersDefaultIndex
    )
  })

  it("index > should return error when reference index's parent is not a record", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customersDefaultIndex.indexType = "reference"
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "indexType",
      hierarchy.customersDefaultIndex
    )
  })

  it("field > should return error when a field is invalid", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = hierarchy.customerRecord.fields[0]
    invalidField.name = ""
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "name", invalidField)
  })

  it("aggregateGroup > should return error when name is not supplied", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customersNoGroupaggregateGroup.name = ""
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "name",
      hierarchy.customersNoGroupaggregateGroup
    )
  })

  it("aggregate > should return error when name note set", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.allCustomersOwedFunctions.name = ""
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "name",
      hierarchy.allCustomersOwedFunctions
    )
  })

  it("aggregate > should return error when condition does not compile", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.customersNoGroupaggregateGroup.condition = "invalid condition"
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "condition",
      hierarchy.customersNoGroupaggregateGroup
    )
  })

  it("aggregate > should return error when aggregatedValue does not compile", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.allCustomersOwedFunctions.aggregatedValue = "invalid value"
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "aggregatedValue",
      hierarchy.allCustomersOwedFunctions
    )
  })

  it("aggregate > should be valid when valid condition and aggregatedValue supplied", () => {
    const hierarchy = createValidHierarchy()
    hierarchy.allCustomersOwedFunctions.aggregatedValue = "return record.owed;"
    hierarchy.allCustomersOwedFunctions.condition = "record.owed > 0;"
    const validationResult = validateAll(hierarchy.root)
    expect(validationResult.length).toBe(0)
  })

  it("field.typeOptions > string > should return error when maxLength <= 0", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "surname")
    invalidField.typeOptions.maxLength = -1
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.maxLength", invalidField)

    invalidField.typeOptions.maxLength = 0
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.maxLength", invalidField)

    invalidField.typeOptions.maxLength = 1
    validationResult = validateAll(hierarchy.root)
    validationResult.length === 0
  })

  it("field.typeOptions > string > should return error allowDeclaredValues only is not a bool", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "surname")
    invalidField.typeOptions.allowDeclaredValuesOnly = null
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.allowDeclaredValuesOnly",
      invalidField
    )

    invalidField.typeOptions.allowDeclaredValuesOnly = ""
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.allowDeclaredValuesOnly",
      invalidField
    )
  })

  it("field.typeOptions > string > should return error when values contains non-string", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "surname")
    invalidField.typeOptions.values = [1]
    const validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.values", invalidField)
  })

  it("field.typeOptions > bool > should return error when allowNulls is not a bool", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "isalive")
    invalidField.typeOptions.allowNulls = "1"
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.allowNulls", invalidField)

    invalidField.typeOptions.allowNulls = null
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.allowNulls", invalidField)
  })

  it("field.typeOptions > datetime > should return error when maxValue is not a date", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "createddate")
    invalidField.typeOptions.maxValue = "1"
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.maxValue", invalidField)

    invalidField.typeOptions.maxValue = "hello"
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.maxValue", invalidField)
  })

  it("field.typeOptions > datetime > should return error when minValue is not a date", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "createddate")
    invalidField.typeOptions.minValue = "1"
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.minValue", invalidField)

    invalidField.typeOptions.minValue = "hello"
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.minValue", invalidField)
  })

  it("field.typeOptions > number > should return error when minValue is not an integer", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "age")
    invalidField.typeOptions.minValue = "hello"
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.minValue", invalidField)

    invalidField.typeOptions.minValue = null
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.minValue", invalidField)

    invalidField.typeOptions.minValue = 1.1
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.minValue", invalidField)
  })

  it("field.typeOptions > number > should return error when maxValue is not an integer", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "age")
    invalidField.typeOptions.maxValue = "hello"
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.maxValue", invalidField)

    invalidField.typeOptions.maxValue = null
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.maxValue", invalidField)

    invalidField.typeOptions.maxValue = 1.1
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(validationResult, "typeOptions.maxValue", invalidField)
  })

  it("field.typeOptions > number > should return error when decimal places is not a positive integer", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "age")
    invalidField.typeOptions.decimalPlaces = "hello"
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.decimalPlaces",
      invalidField
    )

    invalidField.typeOptions.decimalPlaces = null
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.decimalPlaces",
      invalidField
    )

    invalidField.typeOptions.decimalPlaces = -1
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.decimalPlaces",
      invalidField
    )

    invalidField.typeOptions.decimalPlaces = 1.1
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.decimalPlaces",
      invalidField
    )
  })

  it("field.typeOptions > reference > should return error when indexNodeKey is not a compmleted string", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "partner")
    invalidField.typeOptions.indexNodeKey = null
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.indexNodeKey",
      invalidField
    )

    invalidField.typeOptions.indexNodeKey = ""
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.indexNodeKey",
      invalidField
    )

    invalidField.typeOptions.indexNodeKey = 1
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.indexNodeKey",
      invalidField
    )
  })

  it("field.typeOptions > reference > should return error when reverseIndexNodeKeys is not a string array of >0 length", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "partner")
    invalidField.typeOptions.reverseIndexNodeKeys = null
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.reverseIndexNodeKeys",
      invalidField
    )

    invalidField.typeOptions.reverseIndexNodeKeys = ""
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.reverseIndexNodeKeys",
      invalidField
    )

    invalidField.typeOptions.reverseIndexNodeKeys = []
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.reverseIndexNodeKeys",
      invalidField
    )

    invalidField.typeOptions.reverseIndexNodeKeys = "/not/an/array"
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.reverseIndexNodeKeys",
      invalidField
    )

    invalidField.typeOptions.reverseIndexNodeKeys = ["/some/key/here"]
    validationResult = validateAll(hierarchy.root)
    expect(validationResult.length).toBe(0)
  })

  it("field.typeOptions > reference > should return error when displayValue is not a compmleted string", () => {
    const hierarchy = createValidHierarchy()
    const invalidField = findField(hierarchy.customerRecord, "partner")
    invalidField.typeOptions.displayValue = null
    let validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.displayValue",
      invalidField
    )

    invalidField.typeOptions.displayValue = ""
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.displayValue",
      invalidField
    )

    invalidField.typeOptions.displayValue = 1
    validationResult = validateAll(hierarchy.root)
    expectInvalidField(
      validationResult,
      "typeOptions.displayValue",
      invalidField
    )
  })
})
