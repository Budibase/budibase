import { context } from "@budibase/backend-core"
import {
  ArrayOperator,
  BasicOperator,
  FieldType,
  LinkDocument,
  RelationshipType,
  RelationshipFieldMetadata,
  Row,
  SearchFilter,
  SearchFilters,
  Table,
  UILogicalOperator,
  ViewV2,
} from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { basicTable } from "../../tests/utilities/structures"
import { generateJunctionTableID, generateLinkID } from "../../db/utils"
import migration from "./20260708090000_sanitize_relationship_field_names"

const ILLEGAL_FIELD_NAME = "linked!orders"
const SANITISED_FIELD_NAME = "linked_orders"

describe("sanitize relationship field names migration", () => {
  const config = new TestConfiguration()

  let peopleId: string
  let ordersId: string
  let invoicesId: string
  let peopleRowId: string
  let ordersRowId: string

  beforeAll(async () => {
    await config.init()

    const people = await config.api.table.save({
      ...basicTable(),
      name: "people",
    })
    peopleId = people._id!
    const orders = await config.api.table.save({
      ...basicTable(),
      name: "orders",
    })
    ordersId = orders._id!
    const invoices = await config.api.table.save({
      ...basicTable(),
      name: "invoices",
    })
    invoicesId = invoices._id!

    const peopleRow = await config.api.row.save(peopleId, { name: "Alice" })
    peopleRowId = peopleRow._id!
    const ordersRow = await config.api.row.save(ordersId, { name: "Order-1" })
    ordersRowId = ordersRow._id!

    // Seed the "limbo" state an older version (<= 3.39.7) would have left: a
    // relationship whose fieldName contains an illegal character, written
    // straight to the DB to bypass the validation that now rejects it.
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const ordersDoc = await db.get<Table>(ordersId)
      const peopleDoc = await db.get<Table>(peopleId)

      ordersDoc.schema.customer = {
        type: FieldType.LINK,
        name: "customer",
        fieldName: ILLEGAL_FIELD_NAME,
        tableId: peopleId,
        relationshipType: RelationshipType.MANY_TO_MANY,
      }
      peopleDoc.schema[ILLEGAL_FIELD_NAME] = {
        type: FieldType.LINK,
        name: ILLEGAL_FIELD_NAME,
        fieldName: "customer",
        tableId: ordersId,
        relationshipType: RelationshipType.MANY_TO_MANY,
      }

      // a view on people that references the illegal column directly - in its
      // schema, primaryDisplay, sort and saved filters (both the compiled
      // `query` and the `queryUI` group tree, referencing the column directly
      // and through a sub-column)
      peopleDoc.views = {
        "People Grid": {
          version: 2,
          id: "view_people_grid",
          name: "People Grid",
          tableId: peopleId,
          primaryDisplay: ILLEGAL_FIELD_NAME,
          sort: { field: ILLEGAL_FIELD_NAME },
          schema: {
            name: { visible: true },
            [ILLEGAL_FIELD_NAME]: { visible: true },
          },
          query: {
            [BasicOperator.EMPTY]: { [ILLEGAL_FIELD_NAME]: null },
            $and: {
              conditions: [
                {
                  [ArrayOperator.CONTAINS]: {
                    [`${ILLEGAL_FIELD_NAME}.name`]: ["Order-1"],
                  },
                },
              ],
            },
          },
          queryUI: {
            logicalOperator: UILogicalOperator.ALL,
            groups: [
              {
                logicalOperator: UILogicalOperator.ANY,
                filters: [
                  {
                    operator: BasicOperator.EMPTY,
                    field: ILLEGAL_FIELD_NAME,
                    value: null,
                  },
                  {
                    operator: ArrayOperator.CONTAINS,
                    field: `1:${ILLEGAL_FIELD_NAME}.name`,
                    value: ["Order-1"],
                  },
                ],
              },
            ],
          },
        },
      }
      // a view on orders that exposes the illegal column through the
      // relationship field's nested `columns` map, and also filters through the
      // relationship on it (`customer.<illegal>`) in both `query` and `queryUI`
      ordersDoc.views = {
        "Orders Grid": {
          version: 2,
          id: "view_orders_grid",
          name: "Orders Grid",
          tableId: ordersId,
          schema: {
            name: { visible: true },
            customer: {
              visible: true,
              columns: {
                [ILLEGAL_FIELD_NAME]: { visible: true, readonly: false },
                name: { visible: true },
              },
            },
          },
          query: {
            [ArrayOperator.CONTAINS]: {
              [`customer.${ILLEGAL_FIELD_NAME}`]: ["Order-1"],
            },
          },
          queryUI: {
            logicalOperator: UILogicalOperator.ALL,
            groups: [
              {
                logicalOperator: UILogicalOperator.ANY,
                filters: [
                  {
                    operator: ArrayOperator.CONTAINS,
                    field: `1:customer.${ILLEGAL_FIELD_NAME}`,
                    value: ["Order-1"],
                  },
                ],
              },
            ],
          },
        },
      }

      // an invoices table whose only reference to the illegal column is a saved
      // filter (no `columns` map entry, and the view declares no `schema` at
      // all) - proves the cross-table pass rewrites filters for schema-less V2
      // views, not just `columns` maps on views that declare a schema
      const invoicesDoc = await db.get<Table>(invoicesId)
      invoicesDoc.schema.person = {
        type: FieldType.LINK,
        name: "person",
        fieldName: "invoices",
        tableId: peopleId,
        relationshipType: RelationshipType.MANY_TO_MANY,
      }
      invoicesDoc.views = {
        "Invoices Grid": {
          version: 2,
          id: "view_invoices_grid",
          name: "Invoices Grid",
          tableId: invoicesId,
          query: {
            [ArrayOperator.CONTAINS]: {
              [`person.${ILLEGAL_FIELD_NAME}`]: ["Order-1"],
            },
          },
          queryUI: {
            logicalOperator: UILogicalOperator.ALL,
            groups: [
              {
                logicalOperator: UILogicalOperator.ANY,
                filters: [
                  {
                    operator: ArrayOperator.CONTAINS,
                    field: `person.${ILLEGAL_FIELD_NAME}`,
                    value: ["Order-1"],
                  },
                ],
              },
            ],
          },
        },
      }

      const linkDoc: LinkDocument = {
        type: "link",
        _id: generateLinkID(
          ordersId,
          peopleId,
          ordersRowId,
          peopleRowId,
          "customer",
          ILLEGAL_FIELD_NAME
        ),
        tableId: generateJunctionTableID(ordersId, peopleId),
        doc1: {
          tableId: ordersId,
          fieldName: "customer",
          rowId: ordersRowId,
        },
        doc2: {
          tableId: peopleId,
          fieldName: ILLEGAL_FIELD_NAME,
          rowId: peopleRowId,
        },
      }

      await db.bulkDocs([ordersDoc, peopleDoc, invoicesDoc, linkDoc])
    })
  })

  afterAll(() => config.end())

  it("cannot save the table while the illegal fieldName is present", async () => {
    const orders = await config.api.table.get(ordersId)
    await config.api.table.save(orders, {
      status: 400,
      body: { message: "Column names can't contain special characters" },
    })
  })

  it("sanitises the fieldName across both tables and link docs, restoring saves", async () => {
    await config.doInContext(config.getDevWorkspaceId(), () => migration())

    const { orders, people, invoices, linkFieldNames, linkIds } =
      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const orders = await db.get<Table>(ordersId)
        const people = await db.get<Table>(peopleId)
        const invoices = await db.get<Table>(invoicesId)
        const links = await db.allDocs<LinkDocument>({
          startkey: "li",
          endkey: `li￰`,
          include_docs: true,
        })
        const docs = links.rows.map(r => r.doc!)
        return {
          orders,
          people,
          invoices,
          linkFieldNames: docs.flatMap(d => [
            d.doc1.fieldName,
            d.doc2.fieldName,
          ]),
          linkIds: docs.map(d => d._id!),
        }
      })

    // owning table: LINK column fieldName sanitised
    const ordersCustomerColumn = orders.schema
      .customer as RelationshipFieldMetadata
    expect(ordersCustomerColumn.fieldName).toEqual(SANITISED_FIELD_NAME)
    // related table: mirrored column key + name renamed, illegal key gone
    expect(people.schema[ILLEGAL_FIELD_NAME]).toBeUndefined()
    expect(people.schema[SANITISED_FIELD_NAME].name).toEqual(
      SANITISED_FIELD_NAME
    )
    // link docs: fieldName sanitised and no illegal char left in the id
    expect(linkFieldNames).not.toContain(ILLEGAL_FIELD_NAME)
    expect(linkFieldNames).toContain(SANITISED_FIELD_NAME)
    expect(linkIds.some(id => id.includes("!"))).toBe(false)

    // related table's own view: schema key, primaryDisplay and sort updated
    const peopleView = people.views!["People Grid"] as ViewV2
    expect(peopleView.schema![ILLEGAL_FIELD_NAME]).toBeUndefined()
    expect(peopleView.schema![SANITISED_FIELD_NAME]).toBeDefined()
    expect(peopleView.primaryDisplay).toEqual(SANITISED_FIELD_NAME)
    expect(peopleView.sort!.field).toEqual(SANITISED_FIELD_NAME)

    // related table's own view: saved filter references updated in `query`
    const query = peopleView.query as SearchFilters
    expect(query[BasicOperator.EMPTY]![ILLEGAL_FIELD_NAME]).toBeUndefined()
    expect(query[BasicOperator.EMPTY]![SANITISED_FIELD_NAME]).toBeDefined()
    const nested = query.$and!.conditions[0]
    expect(
      nested[ArrayOperator.CONTAINS]![`${ILLEGAL_FIELD_NAME}.name`]
    ).toBeUndefined()
    expect(
      nested[ArrayOperator.CONTAINS]![`${SANITISED_FIELD_NAME}.name`]
    ).toBeDefined()

    // ...and in `queryUI`, preserving the numeric prefix on the sub-column ref
    const uiFilters = peopleView.queryUI!.groups![0].filters as SearchFilter[]
    expect(uiFilters[0].field).toEqual(SANITISED_FIELD_NAME)
    expect(uiFilters[1].field).toEqual(`1:${SANITISED_FIELD_NAME}.name`)

    // owning table's view: relationship `columns` map reference updated
    const ordersView = orders.views!["Orders Grid"] as ViewV2
    const customerField = ordersView.schema!.customer
    const relColumns =
      "columns" in customerField ? customerField.columns : undefined
    expect(relColumns?.[ILLEGAL_FIELD_NAME]).toBeUndefined()
    expect(relColumns?.[SANITISED_FIELD_NAME]).toBeDefined()

    // owning table's view: filter through the relationship (`customer.<col>`)
    // rewritten in both `query` and `queryUI`
    const ordersQuery = ordersView.query as SearchFilters
    expect(
      ordersQuery[ArrayOperator.CONTAINS]![`customer.${ILLEGAL_FIELD_NAME}`]
    ).toBeUndefined()
    expect(
      ordersQuery[ArrayOperator.CONTAINS]![`customer.${SANITISED_FIELD_NAME}`]
    ).toBeDefined()
    const ordersUiFilters = ordersView.queryUI!.groups![0]
      .filters as SearchFilter[]
    expect(ordersUiFilters[0].field).toEqual(
      `1:customer.${SANITISED_FIELD_NAME}`
    )

    // filter-only table: reached by the cross-table pass despite having no
    // `columns` map entry, and its `person.<col>` filter rewritten
    const invoicesView = invoices.views!["Invoices Grid"] as ViewV2
    const invoicesQuery = invoicesView.query as SearchFilters
    expect(
      invoicesQuery[ArrayOperator.CONTAINS]![`person.${ILLEGAL_FIELD_NAME}`]
    ).toBeUndefined()
    expect(
      invoicesQuery[ArrayOperator.CONTAINS]![`person.${SANITISED_FIELD_NAME}`]
    ).toBeDefined()

    // the table can be saved again (validateTable no longer throws)
    const savable = await config.api.table.get(ordersId)
    await config.api.table.save(savable, { status: 200 })

    // the relationship data survived - the order still resolves to Alice
    const enriched: Row = await config.api.row.get(ordersId, ordersRowId)
    expect(enriched.customer).toHaveLength(1)
    expect(enriched.customer[0]._id).toEqual(peopleRowId)
  })
})
