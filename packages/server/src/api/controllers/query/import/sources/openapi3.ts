import { ImportInfo } from "./base"
import { Query, QueryParameter } from "@budibase/types"
import { OpenAPI, OpenAPIV3 } from "openapi-types"
import { OpenAPISource } from "./base/openapi"
import { URL } from "url"

type ServerObject = OpenAPIV3.ServerObject
type ServerVariableObject = OpenAPIV3.ServerVariableObject

const isReferenceObject = (
  value: unknown
): value is OpenAPIV3.ReferenceObject => {
  return (
    value != null &&
    typeof value === "object" &&
    Object.prototype.hasOwnProperty.call(value, "$ref")
  )
}

const isOpenAPI3 = (
  document: OpenAPI.Document
): document is OpenAPIV3.Document => {
  if (!("openapi" in document)) {
    return false
  }
  const { openapi } = document as { openapi: string }
  return openapi.startsWith("3.")
}

const methods: string[] = Object.values(OpenAPIV3.HttpMethods)

/**
 * OpenAPI Version 3.0
 * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.0.md
 */
export class OpenAPI3 extends OpenAPISource {
  document!: OpenAPIV3.Document

  isSupported = async (data: string): Promise<boolean> => {
    try {
      const document = await this.parseData(data)
      if (isOpenAPI3(document)) {
        this.document = document
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  private resolveRef<T>(ref: string): T | undefined {
    if (!ref || !ref.startsWith("#/")) {
      return undefined
    }
    const parts = ref
      .slice(2)
      .split("/")
      .map(part => part.replace(/~1/g, "/").replace(/~0/g, "~"))

    let current: any = this.document
    for (let part of parts) {
      if (current == null || typeof current !== "object") {
        return undefined
      }
      current = current[part]
    }
    return current as T | undefined
  }

  private resolveMaybeRef<T>(
    value: T | OpenAPIV3.ReferenceObject | undefined
  ): T | undefined {
    if (!value) {
      return undefined
    }
    if (isReferenceObject(value)) {
      return this.resolveRef<T>(value.$ref)
    }
    return value as T
  }

  private normalizeParameters(
    params:
      | (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[]
      | undefined
  ): OpenAPIV3.ParameterObject[] {
    if (!Array.isArray(params)) {
      return []
    }
    const resolved: OpenAPIV3.ParameterObject[] = []
    for (let param of params) {
      const normalized = this.resolveMaybeRef<OpenAPIV3.ParameterObject>(param)
      if (normalized) {
        resolved.push(normalized)
      }
    }
    return resolved
  }

  private getMimeTypes(operation: OpenAPIV3.OperationObject): string[] {
    const requestBody = this.resolveMaybeRef<OpenAPIV3.RequestBodyObject>(
      operation.requestBody
    )
    if (!requestBody?.content) {
      return []
    }
    return Object.keys(requestBody.content)
  }

  private getRequestExample(
    operation: OpenAPIV3.OperationObject,
    mimeType?: string
  ) {
    const requestBody = this.resolveMaybeRef<OpenAPIV3.RequestBodyObject>(
      operation.requestBody
    )
    if (!requestBody?.content) {
      return undefined
    }
    const mimeTypes = Object.keys(requestBody.content)
    if (mimeTypes.length === 0) {
      return undefined
    }
    const selected = mimeType || mimeTypes[0]
    const content = requestBody.content[selected]
    if (!content) {
      return undefined
    }
    if (content.example) {
      return content.example
    }
    const schema = this.resolveMaybeRef<OpenAPIV3.SchemaObject>(content.schema)
    return schema?.example
  }

  getInfo = async (): Promise<ImportInfo> => {
    const name = this.document.info.title || "OpenAPI Import"
    return {
      name,
    }
  }

  getImportSource(): string {
    return "openapi3.0"
  }

  getQueries = async (datasourceId: string): Promise<Query[]> => {
    let url: string | URL | undefined
    let serverVariables: Record<string, ServerVariableObject> = {}
    if (this.document.servers?.length) {
      const server = this.document.servers[0] as ServerObject
      url = server.url
      serverVariables = server.variables || {}
    }

    const queries: Query[] = []

    for (let [path, pathItemObject] of Object.entries(this.document.paths)) {
      if (!pathItemObject) {
        continue
      }

      const pathItem = pathItemObject as OpenAPIV3.PathItemObject
      const pathParameters = this.normalizeParameters(pathItem.parameters)

      for (let methodName of methods) {
        const maybeOperation = (pathItem as Record<string, any>)[methodName]
        if (!maybeOperation) {
          continue
        }

        if (!this.isSupportedMethod(methodName)) {
          continue
        }

        const operation = maybeOperation as OpenAPIV3.OperationObject
        const name = operation.operationId || path
        let queryString = ""
        const headers: any = {}
        const parameters: QueryParameter[] = []
        const ensureParameter = (paramName: string, defaultValue = "") => {
          if (!parameters.some(parameter => parameter.name === paramName)) {
            parameters.push({
              name: paramName,
              default: defaultValue,
            })
          }
        }
        const mimeTypes = this.getMimeTypes(operation)
        const requestBody = this.getRequestExample(operation, mimeTypes[0])

        if (mimeTypes.length > 0) {
          headers["Content-Type"] = mimeTypes[0]
        }

        const operationParams = this.normalizeParameters(operation.parameters)
        const allParams = [...pathParameters, ...operationParams]

        for (let param of allParams) {
          switch (param.in) {
            case "query": {
              let prefix = ""
              if (queryString) {
                prefix = "&"
              }
              queryString = `${queryString}${prefix}${param.name}={{${param.name}}}`
              break
            }
            case "header":
              headers[param.name] = `{{${param.name}}}`
              break
            case "path":
              // already captured via path string
              break
            case "formData":
              // future enhancement for multipart/form-data
              break
          }

          if (["query", "header", "path"].includes(param.in)) {
            ensureParameter(param.name)
          }
        }

        for (let [variableName, variable] of Object.entries(serverVariables)) {
          const defaultValue = variable?.default || ""
          ensureParameter(variableName, defaultValue)
        }

        const query = this.constructQuery(
          datasourceId,
          name,
          methodName,
          path,
          url,
          queryString,
          headers,
          parameters,
          requestBody
        )
        queries.push(query)
      }
    }

    return queries
  }
}
