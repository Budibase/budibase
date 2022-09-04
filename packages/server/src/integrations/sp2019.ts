import {
    DatasourceFieldType,
    DatasourcePlus,
    Integration,
    IntegrationBase,
    QueryType,
  } from "@budibase/types"
  
  module SP2019Module {
    interface sp2019Config {
      siteUrl: string
      username: string
      password: string
      domain: string
    }
  
    const SCHEMA: Integration = {
      // Optional link to docs, which gets shown in the UI.
      docs: "https://github.com/koltyakov/sp-jsom-node",
      friendlyName: "SharePoint2019",
      type: "Non-relational",
      description:
        "SharePoint2019 Service to manage sharepoint 2019 on-premise server. ",
      datasource: {
        siteUrl: {
          type: "string",
          default: "http://svrsharepoint4.agglo.local",
          required: true,
        },
        username: {
          type: "string",
          default: "username",
          required: true,
        },
        password: {
          type: "password",
          default: "password",
          required: true,
        },
        domain: {
          type: "string",
          default: "domain",
          required: true,
        },
      },
      query: {
        command: {
          readable: true,
          displayName: "Sharepoint 2019 Get All Lists",
          type: QueryType.JSON,
        },
        create: {
          type: QueryType.FIELDS,
          fields: {
            key: {
              type: DatasourceFieldType.STRING,
              required: true,
            },
            value: {
              type: DatasourceFieldType.STRING,
              required: true,
            }
          },
        },
        read: {
          readable: true,
          type: QueryType.FIELDS,
          fields: {
            key: {
              type: DatasourceFieldType.STRING,
              required: true,
            },
          },
        },
        update: {
            readable: true,
            type: QueryType.FIELDS,
            fields: {
              key: {
                type: DatasourceFieldType.STRING,
                required: true,
              },
            },
          },
        delete: {
          type: QueryType.FIELDS,
          fields: {
            key: {
              type: DatasourceFieldType.STRING,
              required: true,
            },
          },
        }
      },
    }
  
    class SP2019Integration {
      private readonly config: sp2019Config
  
      constructor(config: sp2019Config) {
        this.config = config
      }
  
      request(ctx: any, request: any) {
        const { Headers } = require("@budibase/backend-core/constants")
        const {
          getTenantId,
          isTenantIdSet,
        } = require("@budibase/backend-core/tenancy")
        const env = require("../environment")
  
        if (!request.headers) {
          request.headers = {}
        }
        if (!ctx) {
          request.headers[Headers.API_KEY] = env.INTERNAL_API_KEY
          if (isTenantIdSet()) {
            request.headers[Headers.TENANT_ID] = getTenantId()
          }
        }
        if (request.body && Object.keys(request.body).length > 0) {
          request.headers["Content-Type"] = "application/json"
          request.body =
            typeof request.body === "object"
              ? JSON.stringify(request.body)
              : request.body
        } else {
          delete request.body
        }
        if (ctx && ctx.headers) {
          request.headers = ctx.headers
        }
        return request
      }
  
      async spContext(query: Function) {
        try {
          return await query()
        } catch (err) {
          throw new Error(`Redis error: ${err}`)
        } finally {
          console.log("end")
        }
      }
  
      async getSP2019() {
        try {
          const nodeFetch = require("node-fetch")
          const env = require("../environment")
          const result = await nodeFetch(
            //env.WORKER_URL+'/api/global/sp2019/lists', using sp-jsom-node  crash in worker
            // to solve run : docker run -p 9090:9090 --name=budi-sharepoint --hostname=localhost -d vevedh/budi-vvexpress
            "http://localhost:9090/lists",
            this.request(null, {
              method: "POST",
              body: {
                siteUrl: this.config.siteUrl,
                username: this.config.username,
                password: this.config.password,
                domain: this.config.domain,
              },
            })
          )
  
          const response = await result.json()
          console.log("TEST SHAREPOINT :", response)
          return response
        } catch (error) {
          console.log(`Sharepoint error: ${error}`)
          return { rows: error }
        }
      }
  
      async create(query: { key: string; value: string; ttl: number }) {
        return this.spContext(async () => {
          const response = null
          return response
        })
      }
  
      async read(query: { key: string }) {
        return this.spContext(async () => {
          const response = null
          return response
        })
      }

      async update(query: { key: string }) {
        return this.spContext(async () => {
          const response = null
          return response
        })
      }
  
      async delete(query: { key: string }) {
        return this.spContext(async () => {
          const response = null
          return response
        })
      }
  
      async command(query: { json: string }) {
        return this.spContext(async () => {
          const result = await this.getSP2019()
          console.log("Sharepoint list :", result)
          return result
        })
      }
    }
  
    module.exports = {
      schema: SCHEMA,
      integration: SP2019Integration,
    }
  }