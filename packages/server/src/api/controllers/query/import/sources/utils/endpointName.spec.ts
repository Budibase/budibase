import { buildEndpointName } from "./endpointName"

describe("buildEndpointName", () => {
  it("uses the HubSpot operationId when it is simple", () => {
    const operation = {
      operationId: "getCompany",
      summary: "Get company by ID",
      description: "Returns a company.",
    }

    const name = buildEndpointName(
      operation,
      "get",
      "/crm/v3/objects/companies/{companyId}"
    )

    expect(name).toBe("getCompany")
  })

  it("uses the GitHub summary when the operationId is complex", () => {
    const operation = {
      operationId: "repos/list",
      summary: "List organization repositories",
    }

    const name = buildEndpointName(operation, "get", "/orgs/{org}/repos")

    expect(name).toBe("repos/list")
  })

  it("uses the Stripe description when a summary is missing", () => {
    const operation = {
      description: "Creates a customer.\n\nMore details.",
    }

    const name = buildEndpointName(operation, "post", "/v1/customers")

    expect(name).toBe("Creates a customer.")
  })

  it("falls back to the method and last path segments for HubSpot endpoints", () => {
    const operation = {}

    const name = buildEndpointName(
      operation,
      "get",
      "/crm/v3/objects/companies/{companyId}/associations/contacts"
    )

    expect(name).toBe("Get Associations Contacts")
  })
})
