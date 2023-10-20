import { FieldTypes, AutoFieldSubTypes } from "../../constants"
import { importToRows } from "../../api/controllers/table/utils"
import { cloneDeep } from "lodash/fp"
import LinkDocument from "../linkedRows/LinkDocument"
import { inventoryImport } from "./inventoryImport"
import { employeeImport } from "./employeeImport"
import { jobsImport } from "./jobsImport"
import { expensesImport } from "./expensesImport"
import { db as dbCore } from "@budibase/backend-core"
import {
  Table,
  Row,
  RelationshipType,
  FieldType,
  TableSchema,
} from "@budibase/types"

export const DEFAULT_JOBS_TABLE_ID = "ta_bb_jobs"
export const DEFAULT_INVENTORY_TABLE_ID = "ta_bb_inventory"
export const DEFAULT_EXPENSES_TABLE_ID = "ta_bb_expenses"
export const DEFAULT_EMPLOYEE_TABLE_ID = "ta_bb_employee"
export const DEFAULT_BB_DATASOURCE_ID = "datasource_internal_bb_default"

const defaultDatasource = {
  _id: DEFAULT_BB_DATASOURCE_ID,
  type: dbCore.BUDIBASE_DATASOURCE_TYPE,
  name: "Sample Data",
  source: "BUDIBASE",
  config: {},
}

export const DEFAULT_BB_DATASOURCE = defaultDatasource

function syncLastIds(table: Table, rowCount: number) {
  Object.keys(table.schema).forEach(key => {
    const entry = table.schema[key]
    if (
      entry.autocolumn &&
      entry.type === FieldType.NUMBER &&
      entry.subtype == AutoFieldSubTypes.AUTO_ID
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
    type: FieldTypes.DATETIME,
    subtype: AutoFieldSubTypes.CREATED_AT,
    icon: "ri-magic-line",
    autocolumn: true,
    constraints: {
      type: FieldTypes.STRING,
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
    type: FieldTypes.DATETIME,
    subtype: AutoFieldSubTypes.UPDATED_AT,
    icon: "ri-magic-line",
    autocolumn: true,
    constraints: {
      type: FieldTypes.STRING,
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
  type: "internal",
  views: {},
  sourceId: DEFAULT_BB_DATASOURCE_ID,
  primaryDisplay: "Item Name",
  name: "Inventory",
  schema: {
    "Item ID": {
      name: "Item ID",
      type: FieldTypes.NUMBER,
      subtype: AutoFieldSubTypes.AUTO_ID,
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: FieldTypes.NUMBER,
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
    },
    "Item Name": {
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
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
      type: FieldTypes.ARRAY,
      constraints: {
        type: FieldTypes.ARRAY,
        presence: {
          allowEmpty: false,
        },
        inclusion: ["Electrical", "Material", "Vehicle", "Office", "Tools"],
      },
      name: "Item Tags",
      sortable: false,
    },
    Notes: {
      type: FieldTypes.LONGFORM,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
      name: "Notes",
      useRichText: null,
    },
    Status: {
      type: FieldTypes.ARRAY,
      constraints: {
        type: FieldTypes.ARRAY,
        presence: {
          allowEmpty: false,
        },
        inclusion: ["Available", "Repair", "Broken"],
      },
      name: "Status",
      sortable: false,
    },
    SKU: {
      type: FieldTypes.BARCODEQR,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
      name: "SKU",
    },
    "Purchase Date": {
      type: FieldTypes.DATETIME,
      constraints: {
        type: FieldTypes.STRING,
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
      type: FieldTypes.NUMBER,
      constraints: {
        type: FieldTypes.NUMBER,
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
  type: "internal",
  views: {},
  name: "Employees",
  sourceId: DEFAULT_BB_DATASOURCE_ID,
  primaryDisplay: "First Name",
  schema: {
    "First Name": {
      name: "First Name",
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
    },
    "Last Name": {
      name: "Last Name",
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
    },
    Email: {
      name: "Email",
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
    },
    Address: {
      name: "Address",
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
    },
    City: {
      name: "City",
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
    },
    Postcode: {
      name: "Postcode",
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
    },
    Phone: {
      name: "Phone",
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
    },
    "EMPLOYEE ID": {
      name: "EMPLOYEE ID",
      type: FieldTypes.NUMBER,
      subtype: AutoFieldSubTypes.AUTO_ID,
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: FieldTypes.NUMBER,
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
    },
    "Employee Level": {
      type: FieldTypes.ARRAY,
      constraints: {
        type: FieldTypes.ARRAY,
        presence: false,
        inclusion: ["Manager", "Junior", "Senior", "Apprentice", "Contractor"],
      },
      name: "Employee Level",
      sortable: false,
    },
    "Badge Photo": {
      type: FieldTypes.ATTACHMENT,
      constraints: {
        type: FieldTypes.ARRAY,
        presence: false,
      },
      name: "Badge Photo",
      sortable: false,
    },
    Jobs: {
      type: FieldTypes.LINK,
      constraints: {
        type: FieldTypes.ARRAY,
        presence: false,
      },
      fieldName: "Assigned",
      name: "Jobs",
      relationshipType: RelationshipType.MANY_TO_MANY,
      tableId: DEFAULT_JOBS_TABLE_ID,
    },
    "Start Date": {
      type: FieldTypes.DATETIME,
      constraints: {
        type: FieldTypes.STRING,
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
      type: FieldTypes.DATETIME,
      constraints: {
        type: FieldTypes.STRING,
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
  type: "internal",
  name: "Jobs",
  sourceId: DEFAULT_BB_DATASOURCE_ID,
  primaryDisplay: "Job ID",
  schema: {
    "Job ID": {
      name: "Job ID",
      type: FieldTypes.NUMBER,
      subtype: AutoFieldSubTypes.AUTO_ID,
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: FieldTypes.NUMBER,
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
    },
    "Quote Date": {
      type: FieldTypes.DATETIME,
      constraints: {
        type: FieldTypes.STRING,
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
      type: FieldTypes.NUMBER,
      constraints: {
        type: FieldTypes.NUMBER,
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
      type: FieldTypes.DATETIME,
      constraints: {
        type: FieldTypes.STRING,
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
      type: FieldTypes.LONGFORM,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
      name: "Address",
      useRichText: null,
    },
    "Customer Name": {
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "Customer Name",
    },
    Notes: {
      type: FieldTypes.LONGFORM,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
      name: "Notes",
      useRichText: null,
    },
    "Customer Phone": {
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "Customer Phone",
    },
    "Customer Email": {
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "Customer Email",
    },
    Assigned: {
      name: "Assigned",
      type: FieldTypes.LINK,
      tableId: DEFAULT_EMPLOYEE_TABLE_ID,
      fieldName: "Jobs",
      relationshipType: RelationshipType.MANY_TO_MANY,
      // sortable: true,
    },
    "Works End": {
      type: FieldTypes.DATETIME,
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
      type: FieldTypes.NUMBER,
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
  type: "internal",
  views: {},
  name: "Expenses",
  sourceId: DEFAULT_BB_DATASOURCE_ID,
  primaryDisplay: "Expense ID",
  schema: {
    "Expense ID": {
      name: "Expense ID",
      type: FieldTypes.NUMBER,
      subtype: AutoFieldSubTypes.AUTO_ID,
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: FieldTypes.NUMBER,
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
    },
    "Expense Tags": {
      type: FieldTypes.ARRAY,
      constraints: {
        type: FieldTypes.ARRAY,
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
      type: FieldTypes.NUMBER,
      constraints: {
        type: FieldTypes.NUMBER,
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
      type: FieldTypes.LONGFORM,
      constraints: {
        type: FieldTypes.STRING,
        length: {},
        presence: false,
      },
      name: "Notes",
      useRichText: null,
    },
    "Payment Due": {
      type: FieldTypes.DATETIME,
      constraints: {
        type: FieldTypes.STRING,
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
      type: FieldTypes.DATETIME,
      constraints: {
        type: FieldTypes.STRING,
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
      type: FieldTypes.ATTACHMENT,
      constraints: {
        type: FieldTypes.ARRAY,
        presence: false,
      },
      name: "Attachment",
      sortable: false,
    },
    ...AUTO_COLUMNS,
  },
}

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
        employeeData.rows[index]._id,
        jobData.table._id!,
        "Assigned",
        jobData.rows[index]._id
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
