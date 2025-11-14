import { GetQueriesOptions, ImportInfo } from "./base"
import { Query, QueryParameter } from "@budibase/types"
import { OpenAPIV2 } from "openapi-types"
import { OpenAPISource } from "./base/openapi"
import { URL } from "url"
import {
  GeneratedRequestBody,
  generateRequestBodyFromExample,
  generateRequestBodyFromSchema,
  buildRequestBodyFromFormDataParameters,
  type FormDataParameter,
} from "./utils/requestBody"

const parameterNotRef = (
  param: OpenAPIV2.Parameter | OpenAPIV2.ReferenceObject
): param is OpenAPIV2.Parameter => {
  // all refs are deferenced by parser library
  return true
}

const isOpenAPI2 = (document: any): document is OpenAPIV2.Document => {
  if (document.swagger === "2.0") {
    return true
  } else {
    return false
  }
}

const methods: string[] = Object.values(OpenAPIV2.HttpMethods)

const isOperation = (
  key: string,
  pathItem: any
): pathItem is OpenAPIV2.OperationObject => {
  return methods.includes(key)
}

const isParameter = (
  key: string,
  pathItem: any
): pathItem is OpenAPIV2.Parameter => {
  return !isOperation(key, pathItem)
}

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

  getUrl = (): URL | undefined => {
    const scheme = this.document.schemes?.includes("https") ? "https" : "http"
    const basePath = this.document.basePath || ""
    const host = this.document.host

    if (!host) {
      return undefined
    }

    const normalizedBasePath = basePath
      ? basePath.startsWith("/")
        ? basePath
        : `/${basePath}`
      : ""
    try {
      return new URL(`${scheme}://${host}${normalizedBasePath}`)
    } catch (_err) {
      return undefined
    }
  }

  private getEndpoints = (): ImportInfo["endpoints"] => {
    const endpoints: ImportInfo["endpoints"] = []
    for (let [path, pathItem] of Object.entries(this.document.paths)) {
      for (let [key, opOrParams] of Object.entries(pathItem || {})) {
        if (isParameter(key, opOrParams)) {
          continue
        }
        const methodName = key
        if (!this.isSupportedMethod(methodName)) {
          continue
        }
        const operation = opOrParams as OpenAPIV2.OperationObject
        const name = operation.operationId || path
        endpoints.push({
          id: this.buildEndpointId(methodName, path),
          name,
          method: methodName.toUpperCase(),
          path,
          description: operation.summary || operation.description,
          queryVerb: this.verbFromMethod(methodName),
        })
      }
    }
    return endpoints
  }

  getInfo = async (): Promise<ImportInfo> => {
    const name = this.document.info.title || "Swagger Import"
    const rawUrl = this.getUrl()?.href
    const url = rawUrl ? this.convertPathVariables(rawUrl) : undefined
    const docsUrl =
      this.document.externalDocs?.url ||
      this.document.info?.termsOfService ||
      this.document.info?.contact?.url
    return {
      name,
      url,
      docsUrl,
      endpoints: this.getEndpoints(),
    }
  }

  getImportSource(): string {
    return "openapi2.0"
  }

  getQueries = async (
    datasourceId: string,
    options?: GetQueriesOptions
  ): Promise<Query[]> => {
    const url = this.getUrl()
    const queries = []
    const filterIds = options?.filterIds

    for (let [path, pathItem] of Object.entries(this.document.paths)) {
      // parameters that apply to every operation in the path
      let pathParams: OpenAPIV2.Parameter[] = []

      for (let [key, opOrParams] of Object.entries(pathItem)) {
        if (isParameter(key, opOrParams)) {
          const pathParameters = opOrParams as OpenAPIV2.Parameter[]
          pathParams.push(...pathParameters)
          continue
        }
        // can not be a parameter, must be an operation
        const operation = opOrParams as OpenAPIV2.OperationObject

        const methodName = key
        if (!this.isSupportedMethod(methodName)) {
          continue
        }
        const endpointId = this.buildEndpointId(methodName, path)
        if (filterIds && !filterIds.has(endpointId)) {
          continue
        }
        const name = operation.operationId || path
        let queryString = ""
        const headers: any = {}
        let primaryMimeType: string | undefined
        let requestBody: GeneratedRequestBody | undefined = undefined
        const parameters: QueryParameter[] = []

        if (operation.consumes) {
          primaryMimeType = operation.consumes[0]
          headers["Content-Type"] = primaryMimeType
        }

        const formDataParams: FormDataParameter[] = []

        // combine the path parameters with the operation parameters
        const operationParams = operation.parameters || []
        const allParams = [...pathParams, ...operationParams]

        for (let param of allParams) {
          if (parameterNotRef(param)) {
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
                // do nothing: param is already in the path
                break
              case "formData":
                formDataParams.push({
                  ...(param as OpenAPIV2.ParameterObject),
                  in: "formData",
                } as FormDataParameter)
                break
              case "body": {
                let bodyParam: OpenAPIV2.InBodyParameterObject =
                  param as OpenAPIV2.InBodyParameterObject
                const schema = bodyParam.schema as OpenAPIV2.SchemaObject
                if (schema) {
                  if (schema.example !== undefined) {
                    requestBody = generateRequestBodyFromExample(
                      schema.example,
                      bodyParam.name || "body"
                    )
                  } else {
                    const generated = generateRequestBodyFromSchema(
                      schema,
                      bodyParam.name || "body"
                    )
                    if (generated !== undefined) {
                      requestBody = generated
                    }
                  }
                }
                break
              }
            }

            // add the parameter if it can be bound in our config
            if (["query", "header", "path", "formData"].includes(param.in)) {
              parameters.push({
                name: param.name,
                default: param.default || "",
              })
            }
          }
        }

        if (!requestBody && formDataParams.length > 0) {
          const formDataBody =
            buildRequestBodyFromFormDataParameters(formDataParams)
          if (formDataBody) {
            requestBody = formDataBody
            if (!primaryMimeType) {
              primaryMimeType = formDataParams.some(
                param => param.type === "file"
              )
                ? "multipart/form-data"
                : "application/x-www-form-urlencoded"
            }
            if (primaryMimeType) {
              headers["Content-Type"] = primaryMimeType
            }
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
          requestBody?.body,
          requestBody?.bindings ?? {},
          primaryMimeType
            ? this.bodyTypeFromMimeType(primaryMimeType)
            : undefined
        )
        queries.push(query)
      }
    }

    return queries
  }
}
