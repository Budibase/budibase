import fetch from "node-fetch"
import { getFetchResponse } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  BambooHRStepInputs,
  BambooHRStepOutputs,
} from "@budibase/types"

export async function run({
  inputs,
}: {
  inputs: BambooHRStepInputs
}): Promise<BambooHRStepOutputs> {
  const { subdomain, apiKey, operation, resource, employeeId, employeeData, options } = inputs

  if (!subdomain || !apiKey) {
    return {
      success: false,
      response: {
        message: "BambooHR subdomain and API key are required"
      }
    }
  }

  const baseUrl = `https://api.bamboohr.com/api/gateway.php/${subdomain}/v1`
  
  try {
    let url = ""
    let method = "GET"
    let body = null
    let headers = {
      "Authorization": `Basic ${Buffer.from(`${apiKey}:x`).toString('base64')}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    }

    // Route based on resource and operation
    switch (resource) {
      case "employee":
        switch (operation) {
          case "getAll":
            url = `${baseUrl}/employees/directory`
            method = "GET"
            break
          case "get": {
            if (!employeeId) {
              return {
                success: false,
                response: {
                  message: "Employee ID is required for get operation"
                }
              }
            }
            const fields = options?.fields || ["all"]
            let fieldParam = fields.join(",")
            
            // If "all" is requested, fetch available fields first
            if (fields.includes("all")) {
              const fieldResponse = await fetch(`${baseUrl}/employees/directory`, {
                method: "GET",
                headers
              })
              const fieldData = await getFetchResponse(fieldResponse)
              if (fieldData.status >= 200 && fieldData.status <= 299) {
                const parsedData = JSON.parse(fieldData.message)
                if (parsedData.fields) {
                  fieldParam = parsedData.fields.map((field: any) => field.id).join(",")
                }
              }
            }
            
            url = `${baseUrl}/employees/${employeeId}?fields=${fieldParam}`
            method = "GET"
            break
          }
          case "create":
            if (!employeeData?.firstName || !employeeData?.lastName) {
              return {
                success: false,
                response: {
                  message: "First name and last name are required for creating an employee"
                }
              }
            }
            url = `${baseUrl}/employees`
            method = "POST"
            body = JSON.stringify(employeeData)
            break
          case "update":
            if (!employeeId || !employeeData) {
              return {
                success: false,
                response: {
                  message: "Employee ID and employee data are required for update operation"
                }
              }
            }
            url = `${baseUrl}/employees/${employeeId}`
            method = "POST"
            body = JSON.stringify(employeeData)
            break
          default:
            return {
              success: false,
              response: {
                message: `Unsupported employee operation: ${operation}`
              }
            }
        }
        break
      case "companyReport":
        switch (operation) {
          case "get": {
            const reportId = options?.reportId || "1"
            url = `${baseUrl}/reports/${reportId}?format=JSON`
            method = "GET"
            break
          }
          default:
            return {
              success: false,
              response: {
                message: `Unsupported company report operation: ${operation}`
              }
            }
        }
        break
      case "employeeDocument":
        if (!employeeId) {
          return {
            success: false,
            response: {
              message: "Employee ID is required for employee document operations"
            }
          }
        }
        switch (operation) {
          case "getAll":
            url = `${baseUrl}/employees/${employeeId}/files/view/`
            method = "GET"
            break
          case "get": {
            const docFileId = options?.fileId
            if (!docFileId) {
              return {
                success: false,
                response: {
                  message: "File ID is required for employee document get operation"
                }
              }
            }
            url = `${baseUrl}/employees/${employeeId}/files/${docFileId}/`
            method = "GET"
            break
          }
          case "delete": {
            const delFileId = options?.fileId
            if (!delFileId) {
              return {
                success: false,
                response: {
                  message: "File ID is required for employee document delete operation"
                }
              }
            }
            url = `${baseUrl}/employees/${employeeId}/files/${delFileId}`
            method = "DELETE"
            break
          }
          case "upload": {
            const categoryId = options?.categoryId
            const fileData = options?.fileData
            if (!categoryId || !fileData) {
              return {
                success: false,
                response: {
                  message: "Category ID and file data are required for employee document upload operation"
                }
              }
            }
            url = `${baseUrl}/employees/${employeeId}/files`
            method = "POST"
            // Note: File upload would need special handling for form data
            break
          }
          case "update": {
            const updateFileId = options?.fileId
            if (!updateFileId || !options?.fileData) {
              return {
                success: false,
                response: {
                  message: "File ID and file data are required for employee document update operation"
                }
              }
            }
            url = `${baseUrl}/employees/${employeeId}/files/${updateFileId}`
            method = "POST"
            // Note: File update would need special handling for form data
            break
          }
          default:
            return {
              success: false,
              response: {
                message: `Unsupported employee document operation: ${operation}`
              }
            }
        }
        break
      case "file":
        switch (operation) {
          case "getAll":
            url = `${baseUrl}/files/view`
            method = "GET"
            break
          case "get": {
            const companyFileId = options?.fileId
            if (!companyFileId) {
              return {
                success: false,
                response: {
                  message: "File ID is required for file get operation"
                }
              }
            }
            url = `${baseUrl}/files/${companyFileId}/`
            method = "GET"
            break
          }
          case "delete": {
            const delCompanyFileId = options?.fileId
            if (!delCompanyFileId) {
              return {
                success: false,
                response: {
                  message: "File ID is required for file delete operation"
                }
              }
            }
            url = `${baseUrl}/files/${delCompanyFileId}`
            method = "DELETE"
            break
          }
          case "upload": {
            const companyCategoryId = options?.categoryId
            const companyFileData = options?.fileData
            if (!companyCategoryId || !companyFileData) {
              return {
                success: false,
                response: {
                  message: "Category ID and file data are required for file upload operation"
                }
              }
            }
            url = `${baseUrl}/files`
            method = "POST"
            // Note: File upload would need special handling for form data
            break
          }
          case "update": {
            const updateCompanyFileId = options?.fileId
            if (!updateCompanyFileId || !options?.fileData) {
              return {
                success: false,
                response: {
                  message: "File ID and file data are required for file update operation"
                }
              }
            }
            url = `${baseUrl}/files/${updateCompanyFileId}`
            method = "POST"
            // Note: File update would need special handling for form data
            break
          }
          default:
            return {
              success: false,
              response: {
                message: `Unsupported file operation: ${operation}`
              }
            }
        }
        break
      default:
        return {
          success: false,
          response: {
            message: `Unsupported resource: ${resource}`
          }
        }
    }

    const requestOptions: any = {
      method,
      headers
    }

    if (body) {
      requestOptions.body = body
    }

    const response = await fetch(url, requestOptions)
    const { status, message } = await getFetchResponse(response)

    if (status >= 200 && status <= 299) {
      let responseData
      try {
        responseData = JSON.parse(message)
      } catch (e) {
        // If response is not JSON, return as string
        responseData = message
      }

      // Handle special cases for different operations
      if (resource === "employee" && operation === "create") {
        // Extract employee ID from Location header
        const locationHeader = response.headers.get("location")
        if (locationHeader) {
          const employeeId = locationHeader.substring(locationHeader.lastIndexOf("/") + 1)
          return {
            success: true,
            response: {
              id: employeeId,
              message: "Employee created successfully"
            },
            id: employeeId
          }
        }
      }

      // Handle file upload operations
      if ((resource === "employeeDocument" || resource === "file") && operation === "upload") {
        const locationHeader = response.headers.get("location")
        if (locationHeader) {
          const fileId = locationHeader.substring(locationHeader.lastIndexOf("/") + 1)
          return {
            success: true,
            response: {
              fileId: fileId,
              message: `${resource === "employeeDocument" ? "Employee document" : "File"} uploaded successfully`
            },
            id: fileId
          }
        }
      }

      // Handle delete operations
      if (operation === "delete") {
        return {
          success: true,
          response: {
            message: `${resource === "employeeDocument" ? "Employee document" : resource === "file" ? "File" : "Resource"} deleted successfully`
          }
        }
      }

      // Handle simplified output for file listings
      if (operation === "getAll" && (resource === "employeeDocument" || resource === "file")) {
        const simplifyOutput = options?.simplifyOutput !== false // default to true
        if (simplifyOutput && responseData.categories) {
          const onlyFilesArray: any[] = []
          for (const category of responseData.categories) {
            if (category.files) {
              onlyFilesArray.push(...category.files)
            }
          }
          
          const limit = options?.limit
          const returnAll = options?.returnAll
          
          if (!returnAll && limit && onlyFilesArray.length > limit) {
            return {
              success: true,
              response: onlyFilesArray.slice(0, limit),
              data: onlyFilesArray.slice(0, limit)
            }
          }
          
          return {
            success: true,
            response: onlyFilesArray,
            data: onlyFilesArray
          }
        }
      }

      return {
        success: true,
        response: responseData,
        data: responseData
      }
    } else {
      return {
        success: false,
        response: {
          message: `BambooHR API error: ${message}`,
          status
        }
      }
    }
  } catch (err) {
    return {
      success: false,
      response: {
        message: automationUtils.getError(err)
      }
    }
  }
}