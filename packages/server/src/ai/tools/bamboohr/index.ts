import fetch from "node-fetch"
import { z } from "zod"
import env from "../../../environment"
import { newTool } from ".."

export class BambooHRClient {
  private apiKey: string
  private subdomain: string
  private baseUrl: string

  constructor(apiKey?: string, subdomain?: string) {
    this.apiKey = apiKey || env.BAMBOOHR_API_KEY || ""
    this.subdomain = subdomain || env.BAMBOOHR_SUBDOMAIN || ""
    this.baseUrl = `https://api.bamboohr.com/api/gateway.php/${this.subdomain}/v1`
  }

  /**
   * Get basic auth header for BambooHR API
   */
  private getAuthHeader(): string {
    if (!this.apiKey) {
      throw new Error("BambooHR API key is required for authentication")
    }
    const auth = Buffer.from(`${this.apiKey}:x`).toString("base64")
    return `Basic ${auth}`
  }

  /**
   * Make API request to BambooHR API
   */
  private async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: this.getAuthHeader(),
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP ${response.status}: ${response.statusText} - ${errorText}`
      )
    }

    return response.json()
  }

  getTools() {
    return [
      newTool({
        name: "bamboohr_get_employee",
        description: "Get employee information by ID",
        parameters: z.object({
          employee_id: z.string().describe("The employee ID"),
          fields: z
            .array(z.string())
            .optional()
            .describe("List of fields to retrieve"),
        }),
        handler: async ({
          employee_id,
          fields,
        }: {
          employee_id: string
          fields?: string[]
        }) => {
          const params = fields ? `?fields=${fields.join(",")}` : ""
          const employee = await this.makeRequest(
            `/employees/${employee_id}${params}`
          )
          return JSON.stringify(employee, null, 2)
        },
      }),

      newTool({
        name: "bamboohr_list_employees",
        description: "List all employees",
        parameters: z.object({
          fields: z
            .array(z.string())
            .optional()
            .describe("List of fields to retrieve"),
        }),
        handler: async ({ fields }: { fields?: string[] }) => {
          const params = fields ? `?fields=${fields.join(",")}` : ""
          const employees = await this.makeRequest(
            `/employees/directory${params}`
          )
          return JSON.stringify(employees, null, 2)
        },
      }),

      newTool({
        name: "bamboohr_get_time_off_requests",
        description: "Get time off requests for a date range",
        parameters: z.object({
          start_date: z.string().describe("Start date (YYYY-MM-DD)"),
          end_date: z.string().describe("End date (YYYY-MM-DD)"),
          employee_id: z
            .string()
            .optional()
            .describe("Filter by specific employee ID"),
        }),
        handler: async ({
          start_date,
          end_date,
          employee_id,
        }: {
          start_date: string
          end_date: string
          employee_id?: string
        }) => {
          let endpoint = `/time_off/requests/?start=${start_date}&end=${end_date}`
          if (employee_id) {
            endpoint += `&employeeId=${employee_id}`
          }
          const timeOffRequests = await this.makeRequest(endpoint)
          return JSON.stringify(timeOffRequests, null, 2)
        },
      }),

      newTool({
        name: "bamboohr_get_company_report",
        description: "Get a company report with employee data",
        parameters: z.object({
          format: z
            .enum(["JSON", "XML", "CSV", "PDF", "XLS"])
            .optional()
            .describe("Report format"),
          fields: z
            .array(z.string())
            .optional()
            .describe("List of fields to include"),
        }),
        handler: async ({
          format = "JSON",
          fields,
        }: {
          format?: "JSON" | "XML" | "CSV" | "PDF" | "XLS"
          fields?: string[]
        }) => {
          const params = new URLSearchParams({ format })
          if (fields) {
            params.append("fields", fields.join(","))
          }
          const report = await this.makeRequest(`/reports/custom?${params}`)
          return JSON.stringify(report, null, 2)
        },
      }),

      newTool({
        name: "bamboohr_get_employee_files",
        description: "Get files for a specific employee",
        parameters: z.object({
          employee_id: z.string().describe("The employee ID"),
        }),
        handler: async ({ employee_id }: { employee_id: string }) => {
          const files = await this.makeRequest(
            `/employees/${employee_id}/files/view/`
          )
          return JSON.stringify(files, null, 2)
        },
      }),

      newTool({
        name: "bamboohr_get_custom_fields",
        description: "Get list of custom fields configured in BambooHR",
        parameters: z.object({}),
        handler: async () => {
          const fields = await this.makeRequest("/meta/fields/")
          return JSON.stringify(fields, null, 2)
        },
      }),

      newTool({
        name: "bamboohr_get_tables",
        description: "Get list of available tables in BambooHR",
        parameters: z.object({}),
        handler: async () => {
          const tables = await this.makeRequest("/meta/tables/")
          return JSON.stringify(tables, null, 2)
        },
      }),

      newTool({
        name: "bamboohr_get_employee_table_data",
        description: "Get table data for a specific employee",
        parameters: z.object({
          employee_id: z.string().describe("The employee ID"),
          table_name: z.string().describe("The table name"),
        }),
        handler: async ({
          employee_id,
          table_name,
        }: {
          employee_id: string
          table_name: string
        }) => {
          const tableData = await this.makeRequest(
            `/employees/${employee_id}/tables/${table_name}`
          )
          return JSON.stringify(tableData, null, 2)
        },
      }),

      newTool({
        name: "bamboohr_get_who_is_out",
        description: "Get who is out today or on a specific date",
        parameters: z.object({
          date: z
            .string()
            .optional()
            .describe("Date to check (YYYY-MM-DD), defaults to today"),
        }),
        handler: async ({ date }: { date?: string }) => {
          const endpoint = date
            ? `/time_off/whos_out/?start=${date}&end=${date}`
            : "/time_off/whos_out/"
          const whoIsOut = await this.makeRequest(endpoint)
          return JSON.stringify(whoIsOut, null, 2)
        },
      }),
    ]
  }
}
