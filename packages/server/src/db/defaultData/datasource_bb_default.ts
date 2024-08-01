import {
  DEFAULT_BB_DATASOURCE_ID,
  DEFAULT_EMPLOYEE_TABLE_ID,
  DEFAULT_EXPENSES_TABLE_ID,
  DEFAULT_INVENTORY_TABLE_ID,
  DEFAULT_JOBS_TABLE_ID,
} from "../../constants"
import { importToRows } from "../../api/controllers/table/utils"
import { cloneDeep } from "lodash/fp"
import LinkDocument from "../linkedRows/LinkDocument"
import { inventoryImport } from "./inventoryImport"
import { employeeImport } from "./employeeImport"
import { jobsImport } from "./jobsImport"
import { expensesImport } from "./expensesImport"
import { db as dbCore } from "@budibase/backend-core"
import {
  AutoFieldSubType,
  Datasource,
  FieldType,
  JsonFieldSubType,
  RelationshipType,
  Row,
  SourceName,
  Table,
  TableSchema,
  TableSourceType,
} from "@budibase/types"

const defaultDatasource: Datasource = {
  _id: DEFAULT_BB_DATASOURCE_ID,
  type: dbCore.BUDIBASE_DATASOURCE_TYPE,
  name: "Sample Data",
  source: SourceName.BUDIBASE,
  config: {},
}

export const DEFAULT_BB_DATASOURCE = defaultDatasource

function syncLastIds(table: Table, rowCount: number) {
  Object.keys(table.schema).forEach(key => {
    const entry = table.schema[key]
    if (
      entry.autocolumn &&
      entry.type === FieldType.NUMBER &&
      entry.subtype == AutoFieldSubType.AUTO_ID
    ) {
      entry.lastID = rowCount
    }
  })
}

async function tableImport(table: Table, data: Row[]) {
  const cloneTable = cloneDeep(table)
  const rowDocs = await importToRows(data, cloneTable)
  syncLastIds(cloneTable, rowDocs.length)
  return { rows: rowDocs, table: cloneTable }
}

// AUTO COLUMNS
const AUTO_COLUMNS: TableSchema = {
  "Created At": {
    name: "Created At",
    type: FieldType.DATETIME,
    subtype: AutoFieldSubType.CREATED_AT,
    icon: "ri-magic-line",
    autocolumn: true,
    constraints: {
      type: FieldType.STRING,
      length: {},
      presence: false,
      datetime: {
        latest: "",
        earliest: "",
      },
    },
  },
  "Updated At": {
    name: "Updated At",
    type: FieldType.DATETIME,
    subtype: AutoFieldSubType.UPDATED_AT,
    icon: "ri-magic-line",
    autocolumn: true,
    constraints: {
      type: FieldType.STRING,
      length: {},
      presence: false,
      datetime: {
        latest: "",
        earliest: "",
      },
    },
  },
}

export const DEFAULT_INVENTORY_TABLE_SCHEMA: Table = {
  _id: DEFAULT_INVENTORY_TABLE_ID,
  type: "table",
  views: {},
  sourceId: DEFAULT_BB_DATASOURCE_ID,
  sourceType: TableSourceType.INTERNAL,
  primaryDisplay: "Item Name",
  name: "Inventory",
  schema: {
    "Item ID": {
      name: "Item ID",
      type: FieldType.NUMBER,
      subtype: AutoFieldSubType.AUTO_ID,
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: FieldType.NUMBER,
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
    },
    "Item Name": {
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {
          maximum: null,
        },
        presence: {
          allowEmpty: false,
        },
      },
      name: "Item Name",
    },
    "Item Tags": {
      type: FieldType.ARRAY,
      constraints: {
        type: JsonFieldSubType.ARRAY,
        presence: {
          allowEmpty: false,
        },
        inclusion: ["Electrical", "Material", "Vehicle", "Office", "Tools"],
      },
      name: "Item Tags",
      sortable: false,
    },
    Notes: {
      type: FieldType.LONGFORM,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
      name: "Notes",
      useRichText: null,
    },
    Status: {
      type: FieldType.ARRAY,
      constraints: {
        type: JsonFieldSubType.ARRAY,
        presence: {
          allowEmpty: false,
        },
        inclusion: ["Available", "Repair", "Broken"],
      },
      name: "Status",
      sortable: false,
    },
    SKU: {
      type: FieldType.BARCODEQR,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
      name: "SKU",
    },
    "Purchase Date": {
      type: FieldType.DATETIME,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
        datetime: {
          latest: "",
          earliest: "",
        },
      },
      name: "Purchase Date",
      ignoreTimezones: true,
    },
    "Purchase Price": {
      type: FieldType.NUMBER,
      constraints: {
        type: FieldType.NUMBER,
        presence: false,
        numericality: {
          greaterThanOrEqualTo: null,
          lessThanOrEqualTo: "",
        },
      },
      name: "Purchase Price",
    },
    ...AUTO_COLUMNS,
  },
}

export const DEFAULT_EMPLOYEE_TABLE_SCHEMA: Table = {
  _id: DEFAULT_EMPLOYEE_TABLE_ID,
  type: "table",
  views: {},
  name: "Employees",
  sourceId: DEFAULT_BB_DATASOURCE_ID,
  sourceType: TableSourceType.INTERNAL,
  primaryDisplay: "First Name",
  schema: {
    "First Name": {
      name: "First Name",
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
    },
    "Last Name": {
      name: "Last Name",
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
    },
    Email: {
      name: "Email",
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
    },
    Address: {
      name: "Address",
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
    },
    City: {
      name: "City",
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
    },
    Postcode: {
      name: "Postcode",
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
    },
    Phone: {
      name: "Phone",
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
    },
    "EMPLOYEE ID": {
      name: "EMPLOYEE ID",
      type: FieldType.NUMBER,
      subtype: AutoFieldSubType.AUTO_ID,
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: FieldType.NUMBER,
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
    },
    "Employee Level": {
      type: FieldType.ARRAY,
      constraints: {
        type: JsonFieldSubType.ARRAY,
        presence: false,
        inclusion: ["Manager", "Junior", "Senior", "Apprentice", "Contractor"],
      },
      name: "Employee Level",
      sortable: false,
    },
    "Badge Photo": {
      type: FieldType.ATTACHMENTS,
      constraints: {
        type: FieldType.ARRAY,
        presence: false,
      },
      name: "Badge Photo",
      sortable: false,
    },
    Jobs: {
      type: FieldType.LINK,
      constraints: {
        type: FieldType.ARRAY,
        presence: false,
      },
      fieldName: "Assigned",
      name: "Jobs",
      relationshipType: RelationshipType.MANY_TO_MANY,
      tableId: DEFAULT_JOBS_TABLE_ID,
    },
    "Start Date": {
      type: FieldType.DATETIME,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
        datetime: {
          latest: "",
          earliest: "",
        },
      },
      name: "Start Date",
      ignoreTimezones: true,
    },
    "End Date": {
      type: FieldType.DATETIME,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
        datetime: {
          latest: "",
          earliest: "",
        },
      },
      name: "End Date",
      ignoreTimezones: true,
    },
    ...AUTO_COLUMNS,
  },
}

export const DEFAULT_JOBS_TABLE_SCHEMA: Table = {
  _id: DEFAULT_JOBS_TABLE_ID,
  type: "table",
  name: "Jobs",
  sourceId: DEFAULT_BB_DATASOURCE_ID,
  sourceType: TableSourceType.INTERNAL,
  primaryDisplay: "Job ID",
  schema: {
    "Job ID": {
      name: "Job ID",
      type: FieldType.NUMBER,
      subtype: AutoFieldSubType.AUTO_ID,
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: FieldType.NUMBER,
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
    },
    "Quote Date": {
      type: FieldType.DATETIME,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: {
          allowEmpty: false,
        },
        datetime: {
          latest: "",
          earliest: "",
        },
      },
      name: "Quote Date",
      ignoreTimezones: true,
    },
    "Quote Price": {
      type: FieldType.NUMBER,
      constraints: {
        type: FieldType.NUMBER,
        presence: {
          allowEmpty: false,
        },
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
      name: "Quote Price",
    },
    "Works Start": {
      type: FieldType.DATETIME,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
        datetime: {
          latest: "",
          earliest: "",
        },
      },
      name: "Works Start",
      ignoreTimezones: true,
    },
    Address: {
      type: FieldType.LONGFORM,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
      name: "Address",
      useRichText: null,
    },
    "Customer Name": {
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "Customer Name",
    },
    Notes: {
      type: FieldType.LONGFORM,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
      name: "Notes",
      useRichText: null,
    },
    "Customer Phone": {
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "Customer Phone",
    },
    "Customer Email": {
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "Customer Email",
    },
    Assigned: {
      name: "Assigned",
      type: FieldType.LINK,
      tableId: DEFAULT_EMPLOYEE_TABLE_ID,
      fieldName: "Jobs",
      relationshipType: RelationshipType.MANY_TO_MANY,
      // sortable: true,
    },
    "Works End": {
      type: FieldType.DATETIME,
      constraints: {
        type: "string",
        length: {},
        presence: false,
        datetime: {
          latest: "",
          earliest: "",
        },
      },
      name: "Works End",
      ignoreTimezones: true,
    },
    "Updated Price": {
      type: FieldType.NUMBER,
      constraints: {
        type: "number",
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
      name: "Updated Price",
    },
    ...AUTO_COLUMNS,
  },
}

export const DEFAULT_EXPENSES_TABLE_SCHEMA: Table = {
  _id: DEFAULT_EXPENSES_TABLE_ID,
  type: "table",
  views: {},
  name: "Expenses",
  sourceId: DEFAULT_BB_DATASOURCE_ID,
  sourceType: TableSourceType.INTERNAL,
  primaryDisplay: "Expense ID",
  schema: {
    "Expense ID": {
      name: "Expense ID",
      type: FieldType.NUMBER,
      subtype: AutoFieldSubType.AUTO_ID,
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: FieldType.NUMBER,
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
    },
    "Expense Tags": {
      type: FieldType.ARRAY,
      constraints: {
        type: JsonFieldSubType.ARRAY,
        presence: {
          allowEmpty: false,
        },
        inclusion: [
          "Fuel",
          "Food",
          "Materials",
          "Repair",
          "Equipment",
          "Fees",
          "Service",
          "Office",
          "Other",
        ],
      },
      name: "Expense Tags",
      sortable: false,
    },
    Cost: {
      type: FieldType.NUMBER,
      constraints: {
        type: FieldType.NUMBER,
        presence: {
          allowEmpty: false,
        },
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
      name: "Cost",
    },
    Notes: {
      type: FieldType.LONGFORM,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
      },
      name: "Notes",
      useRichText: null,
    },
    "Payment Due": {
      type: FieldType.DATETIME,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
        datetime: {
          latest: "",
          earliest: "",
        },
      },
      name: "Payment Due",
      ignoreTimezones: true,
    },
    "Date Paid": {
      type: FieldType.DATETIME,
      constraints: {
        type: FieldType.STRING,
        length: {},
        presence: false,
        datetime: {
          latest: "",
          earliest: "",
        },
      },
      name: "Date Paid",
      ignoreTimezones: true,
    },
    Attachment: {
      type: FieldType.ATTACHMENTS,
      constraints: {
        type: FieldType.ARRAY,
        presence: false,
      },
      name: "Attachment",
      sortable: false,
    },
    ...AUTO_COLUMNS,
  },
}

export const DEFAULT_TABLES: Table[] = [
  DEFAULT_INVENTORY_TABLE_SCHEMA,
  DEFAULT_EMPLOYEE_TABLE_SCHEMA,
  DEFAULT_JOBS_TABLE_SCHEMA,
  DEFAULT_EXPENSES_TABLE_SCHEMA,
]

export async function buildDefaultDocs() {
  const inventoryData = await tableImport(
    DEFAULT_INVENTORY_TABLE_SCHEMA,
    inventoryImport
  )

  const employeeData = await tableImport(
    DEFAULT_EMPLOYEE_TABLE_SCHEMA,
    employeeImport
  )

  const jobData = await tableImport(DEFAULT_JOBS_TABLE_SCHEMA, jobsImport)

  const expensesData = await tableImport(
    DEFAULT_EXPENSES_TABLE_SCHEMA,
    expensesImport
  )

  // Build one link doc for each employee/job
  const jobEmployeeLinks = employeeData.rows.map(
    (employee: any, index: any) => {
      return new LinkDocument(
        employeeData.table._id!,
        "Jobs",
        employeeData.rows[index]._id!,
        jobData.table._id!,
        "Assigned",
        jobData.rows[index]._id!
      )
    }
  )

  const dataSource = {
    ...defaultDatasource,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  return [
    dataSource,
    inventoryData.table,
    employeeData.table,
    jobData.table,
    expensesData.table,
    ...inventoryData.rows,
    ...employeeData.rows,
    ...jobData.rows,
    ...expensesData.rows,
    ...jobEmployeeLinks,
  ]
}
