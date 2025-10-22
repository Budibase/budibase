import { ImportInfo } from "./base"
import { Query, QueryParameter } from "@budibase/types"
import { OpenAPIV2 } from "openapi-types"
import { OpenAPISource } from "./base/openapi"
import { URL } from "url"

const isReferenceObject = (
  value: unknown
): value is OpenAPIV2.ReferenceObject => {
  return (
    value != null &&
    typeof value === "object" &&
    Object.prototype.hasOwnProperty.call(value, "$ref")
  )
}

const isOpenAPI2 = (document: any): document is OpenAPIV2.Document => {
  if (document.swagger === "2.0") {
    return true
  } else {
    return false
  }
}

const methods: string[] = Object.values(OpenAPIV2.HttpMethods)

/**
 * OpenAPI Version 2.0 - aka "Swagger"
 * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md
 */
export class OpenAPI2 extends OpenAPISource {
  document!: OpenAPIV2.Document

  isSupported = async (data: string): Promise<boolean> => {
    try {
      const document: any = await this.parseData(data)
      if (isOpenAPI2(document)) {
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
    value: T | OpenAPIV2.ReferenceObject | undefined
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
      | (OpenAPIV2.Parameter | OpenAPIV2.ReferenceObject)[]
      | undefined
  ): OpenAPIV2.Parameter[] {
    if (!Array.isArray(params)) {
      return []
    }
    const resolved: OpenAPIV2.Parameter[] = []
    for (let param of params) {
      const normalized = this.resolveMaybeRef<OpenAPIV2.Parameter>(param)
      if (normalized) {
        resolved.push(normalized)
      }
    }
    return resolved
  }

  getUrl = (): URL => {
    const scheme = this.document.schemes?.includes("https") ? "https" : "http"
    const basePath = this.document.basePath || ""
    const host = this.document.host || "<host>"
    return new URL(`${scheme}://${host}${basePath}`)
  }

  getInfo = async (): Promise<ImportInfo> => {
    const name = this.document.info.title || "Swagger Import"
    return {
      name,
    }
  }

  getImportSource(): string {
    return "openapi2.0"
  }

  getQueries = async (datasourceId: string): Promise<Query[]> => {
    const url = this.getUrl()
    const queries = []

    for (let [path, pathItem] of Object.entries(this.document.paths)) {
      if (!pathItem) {
        continue
      }

      const pathParameters = this.normalizeParameters(
        (pathItem as OpenAPIV2.PathItemObject).parameters
      )

      for (let methodName of methods) {
        const maybeOperation = (pathItem as Record<string, any>)[methodName]
        if (!maybeOperation) {
          continue
        }

        if (!this.isSupportedMethod(methodName)) {
          continue
        }
        const operation = maybeOperation as OpenAPIV2.OperationObject
        const name = operation.operationId || path
        let queryString = ""
        const headers: any = {}
        const parameters: QueryParameter[] = []
        let requestBody = undefined

        if (operation.consumes) {
          headers["Content-Type"] = operation.consumes[0]
        }

        // combine the path parameters with the operation parameters
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
              // already represented in URL
              break
            case "formData":
              // future enhancement
              break
            case "body": {
              const bodyParam = param as OpenAPIV2.InBodyParameterObject
              const schema = this.resolveMaybeRef<OpenAPIV2.SchemaObject>(
                bodyParam.schema
              )
              if (schema?.example) {
                requestBody = schema.example
              }
              break
            }
          }

          if (["query", "header", "path"].includes(param.in)) {
            parameters.push({
              name: param.name,
              default: param.default || "",
            })
          }
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
