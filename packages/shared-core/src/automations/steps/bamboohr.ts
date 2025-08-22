import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "BambooHR",
  tagline: "Interact with {{inputs.resource}} using BambooHR",
  icon: "user",
  description: "Perform operations with BambooHR API - manage employees, reports, and documents",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  stepId: AutomationActionStepId.BAMBOOHR,
  inputs: {
    subdomain: "your-company",
    apiKey: "",
    resource: "employee",
    operation: "getAll",
  },
  schema: {
    inputs: {
      properties: {
        subdomain: {
          type: AutomationIOType.STRING,
          title: "Subdomain",
          description: "Your BambooHR company subdomain (e.g., 'yourcompany' from yourcompany.bamboohr.com)",
        },
        apiKey: {
          type: AutomationIOType.PASSWORD,
          title: "API Key",
          description: "Your BambooHR API key",
        },
        resource: {
          type: AutomationIOType.STRING,
          title: "Resource",
          enum: ["employee", "companyReport", "employeeDocument", "file"],
          description: "The BambooHR resource to interact with",
        },
        operation: {
          type: AutomationIOType.STRING,
          title: "Operation",
          enum: ["get", "getAll", "create", "update", "delete"],
          description: "The operation to perform on the selected resource",
        },
        employeeId: {
          type: AutomationIOType.STRING,
          title: "Employee ID",
          description: "Required for get, update, and delete operations on employees",
          customType: AutomationCustomIOType.TEXT,
        },
        employeeData: {
          type: AutomationIOType.OBJECT,
          title: "Employee Data",
          description: "Employee data for create and update operations",
          customType: AutomationCustomIOType.WIDE,
          properties: {
            firstName: {
              type: AutomationIOType.STRING,
              title: "First Name",
            },
            lastName: {
              type: AutomationIOType.STRING,
              title: "Last Name",
            },
            workEmail: {
              type: AutomationIOType.STRING,
              title: "Work Email",
            },
            department: {
              type: AutomationIOType.STRING,
              title: "Department",
            },
            jobTitle: {
              type: AutomationIOType.STRING,
              title: "Job Title",
            },
            hireDate: {
              type: AutomationIOType.STRING,
              title: "Hire Date",
              description: "Format: YYYY-MM-DD",
            },
            workPhone: {
              type: AutomationIOType.STRING,
              title: "Work Phone",
            },
            mobilePhone: {
              type: AutomationIOType.STRING,
              title: "Mobile Phone",
            },
            gender: {
              type: AutomationIOType.STRING,
              title: "Gender",
              enum: ["Male", "Female", "Other"],
            },
            dateOfBirth: {
              type: AutomationIOType.STRING,
              title: "Date of Birth",
              description: "Format: YYYY-MM-DD",
            },
            maritalStatus: {
              type: AutomationIOType.STRING,
              title: "Marital Status",
              enum: ["Single", "Married", "Divorced", "Widowed"],
            },
            employeeNumber: {
              type: AutomationIOType.STRING,
              title: "Employee Number",
            },
            location: {
              type: AutomationIOType.STRING,
              title: "Location",
            },
            division: {
              type: AutomationIOType.STRING,
              title: "Division",
            },
            payType: {
              type: AutomationIOType.STRING,
              title: "Pay Type",
              enum: ["Salary", "Hourly", "Commission"],
            },
            exempt: {
              type: AutomationIOType.STRING,
              title: "Exempt Status",
              enum: ["Yes", "No"],
            },
          },
        },
        options: {
          type: AutomationIOType.OBJECT,
          title: "Additional Options",
          description: "Additional configuration options",
          customType: AutomationCustomIOType.WIDE,
          properties: {
            fields: {
              type: AutomationIOType.ARRAY,
              title: "Fields to Return",
              description: "Specific fields to return (for get operations). Leave empty or use 'all' for all fields",
              items: {
                type: AutomationIOType.STRING,
              },
            },
            reportId: {
              type: AutomationIOType.STRING,
              title: "Report ID",
              description: "Required for company report operations",
            },
            limit: {
              type: AutomationIOType.NUMBER,
              title: "Limit",
              description: "Maximum number of results to return",
            },
            returnAll: {
              type: AutomationIOType.BOOLEAN,
              title: "Return All",
              description: "Whether to return all results (ignores limit)",
            },
          },
        },
      },
      required: ["subdomain", "apiKey", "resource", "operation"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the BambooHR operation was successful",
        },
        response: {
          type: AutomationIOType.OBJECT,
          description: "The response from BambooHR API",
        },
        data: {
          type: AutomationIOType.OBJECT,
          description: "The data returned from BambooHR",
        },
        id: {
          type: AutomationIOType.STRING,
          description: "The ID of created/updated resource",
        },
      },
      required: ["success", "response"],
    },
  },
}