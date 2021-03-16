const TestConfig = require("../../tests/utilities/TestConfiguration")
const { basicTable } = require("../../tests/utilities/structures")
const LinkController = require("../linkedRows/LinkController")
const { RelationshipTypes } = require("../../constants")

describe("test the link controller", () => {
  let config = new TestConfig(false)
  let table1, table2

  beforeEach(async () => {
    await config.init()
    const { _id } = await config.createTable()
    table2 = await config.createLinkedTable()
    // update table after creating link
    table1 = await config.getTable(_id)
  })

  afterAll(config.end)

  function createLinkController(table, row = null, oldTable = null) {
    const linkConfig = {
      appId: config.getAppId(),
      tableId: table._id,
      table,
    }
    if (row) {
      linkConfig.row = row
    }
    if (oldTable) {
      linkConfig.oldTable = oldTable
    }
    return new LinkController(linkConfig)
  }

  it("should be able to confirm if two table schemas are equal", () => {
    const controller = createLinkController(table1)
    let equal = controller.areLinkSchemasEqual(table2.schema.link, table2.schema.link)
    expect(equal).toEqual(true)
    equal = controller.areLinkSchemasEqual(table1.schema.link, table2.schema.link)
    expect(equal).toEqual(false)
  })

  it("should be able to check the relationship types across two fields", () => {
    const controller = createLinkController(table1)
    // empty case
    let output = controller.handleRelationshipType({}, {})
    expect(output.linkedField.relationshipType).toEqual(RelationshipTypes.MANY_TO_MANY)
    expect(output.linkerField.relationshipType).toEqual(RelationshipTypes.MANY_TO_MANY)
    output = controller.handleRelationshipType({ relationshipType: RelationshipTypes.MANY_TO_MANY }, {})
    expect(output.linkedField.relationshipType).toEqual(RelationshipTypes.MANY_TO_MANY)
    expect(output.linkerField.relationshipType).toEqual(RelationshipTypes.MANY_TO_MANY)
    output = controller.handleRelationshipType({ relationshipType: RelationshipTypes.MANY_TO_ONE }, {})
    expect(output.linkedField.relationshipType).toEqual(RelationshipTypes.ONE_TO_MANY)
    expect(output.linkerField.relationshipType).toEqual(RelationshipTypes.MANY_TO_ONE)
    output = controller.handleRelationshipType({ relationshipType: RelationshipTypes.ONE_TO_MANY }, {})
    expect(output.linkedField.relationshipType).toEqual(RelationshipTypes.MANY_TO_ONE)
    expect(output.linkerField.relationshipType).toEqual(RelationshipTypes.ONE_TO_MANY)
  })
})
