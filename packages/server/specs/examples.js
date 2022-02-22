const baseRow = {
  _id: "ro_ta_5b1649e42a5b41dea4ef7742a36a7a70_e6dc7e38cf1343b2b56760265201cda4",
  type: "row",
  tableId: "ta_5b1649e42a5b41dea4ef7742a36a7a70",
  name: "Mike",
  age: 30,
}

const inputRow = {
  ...baseRow,
  relationship: ["ro_ta_..."],
}

const row = {
  ...baseRow,
  relationship: [
    {
      primaryDisplay: "Joe",
      _id: "ro_ta_...",
    },
  ],
}

const table = {
  _id: "ta_5b1649e42a5b41dea4ef7742a36a7a70",
  name: "People",
  schema: {
    name: {
      type: "string",
      name: "name",
    },
    age: {
      type: "number",
      name: "age",
    },
    relationship: {
      type: "link",
      name: "relationship",
      tableId: "ta_...",
      fieldName: "relatedColumn",
      relationshipType: "many-to-many",
    },
  },
}

const query = {
  _id: "query_datasource_plus_4d8be0c506b9465daf4bf84d890fdab6_454854487c574d45bc4029b1e153219e",
  datasourceId: "datasource_plus_4d8be0c506b9465daf4bf84d890fdab6",
  parameters: [],
  fields: {
    sql: "select * from persons",
  },
  queryVerb: "read",
  name: "Help",
  schema: {
    personid: {
      name: "personid",
      type: "string",
    },
    lastname: {
      name: "lastname",
      type: "string",
    },
    firstname: {
      name: "firstname",
      type: "string",
    },
    address: {
      name: "address",
      type: "string",
    },
    city: {
      name: "city",
      type: "string",
    },
  },
  transformer: "return data",
  readable: true,
}

const user = {
  _id: "us_693a73206518477283a8d5ae31103252",
  email: "test@test.com",
  roles: {
    app_957b12f943d348faa61db7e18e088d0f: "BASIC",
  },
  builder: {
    global: false,
  },
  admin: {
    global: true,
  },
  tenantId: "default",
  status: "active",
  budibaseAccess: true,
  csrfToken: "9c70291d-7137-48f9-9166-99ab5473a3d4",
  userId: "us_693a73206518477283a8d5ae31103252",
  roleId: "ADMIN",
  role: {
    _id: "ADMIN",
    name: "Admin",
    permissionId: "admin",
    inherits: "POWER",
  },
}

const application = {
  _id: "app_metadata",
  appId: "app_dev_957b12f943d348faa61db7e18e088d0f",
  version: "1.0.58-alpha.0",
  name: "App name",
  url: "/app-url",
  tenantId: "default",
  updatedAt: "2022-02-22T13:00:54.035Z",
  createdAt: "2022-02-11T18:02:26.961Z",
  status: "development",
  lockedBy: user,
}

exports.table = {
  value: {
    table: table,
  },
}

exports.tables = {
  value: {
    tables: [table],
  },
}

exports.inputRow = {
  value: inputRow,
}

exports.row = {
  value: {
    row: row,
  },
}

exports.rows = {
  value: {
    rows: [row],
    hasNextPage: true,
    bookmark: 10,
  },
}

exports.user = {
  value: {
    user: user,
  },
}

exports.users = {
  value: {
    users: [user],
  },
}

exports.query = {
  value: {
    query: query,
  },
}

exports.queries = {
  value: {
    queries: [query],
  },
}

exports.application = {
  value: {
    application: application,
  },
}

exports.applications = {
  value: {
    applications: [application],
  },
}
