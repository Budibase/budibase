const userResource = require("./user")
const { object } = require("./utils")
const Resource = require("./utils/Resource")

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
  lockedBy: userResource.getExamples().user.value.user,
}

const applicationSchema = object(
  {
    name: {
      type: "string",
    },
    url: {
      type: "string",
    },
  },
  { required: ["name", "url"] }
)

module.exports = new Resource()
  .setExamples({
    application: {
      value: {
        application: application,
      },
    },
    applications: {
      value: {
        applications: [application],
      },
    },
  })
  .setSchemas({
    application: applicationSchema,
    applicationOutput: object({
      application: applicationSchema,
    }),
  })
