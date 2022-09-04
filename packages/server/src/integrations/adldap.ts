import { Integration, QueryType, IntegrationBase, DatasourceFieldType } from "@budibase/types"
import { Client } from 'ldapts';


module AdLdapModule {
  

  interface AdLdapConfig  {
    url: string
    bindDN: string
    secret: string
    baseDN: string
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/saostad/ldap-ts-client#readme",
    description:
      "LDAP Client to connect your Active Directory LDAP Server.",
      friendlyName: "AD Ldap",
      type: "Non-relational",
    datasource: {
      url: {
        type: "string",
        required: false,
        default: "ldap://domain.com",
      },
      bindDN: {
        type: "string",
        required: true,
      },
      secret: {
        type: "password",
        required: true,
      },
      baseDN: {
        type: "string",
        required: false,
      },

    },
    query: {
      command: {
        readable: true,
        displayName: "Get Ldap users",
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

  class AdLdapIntegration  {
    private readonly config: AdLdapConfig
    private client:Client;
    

    constructor(config: AdLdapConfig) {
      this.config = config
      this.client = new Client({
        url: this.config.url,
        timeout: 0,
        connectTimeout: 0,
        /*tlsOptions: {
          minVersion: 'TLSv1.2',
        },*/
        strictDN: true,
      })
    }


    async ldapContext(query: Function) {
      try {
        return await query()
      } catch (err) {
        throw new Error(`AD Ldap error: ${err}`)
      } finally {
        console.log("end")
      }
    }


    async create(query: { key: string; value: string; ttl: number }) {
      return this.ldapContext(async () => {
        const response = null
        return response
      })
    }

    async read(query: { key: string }) {
      return this.ldapContext(async () => {
        const response = null
        return response
      })
    }

    async update(query: { key: string }) {
      return this.ldapContext(async () => {
        const response = null
        return response
      })
    }

    async delete(query: { key: string }) {
      return this.ldapContext(async () => {
        const response = null
        return response
      })
    }
    async command(query: { bucket: string }) {
      return this.ldapContext(async () => {
        
        console.log("Client crée :",this.client)
        
        if (this.client.isConnected) {
          console.log("Client ldap connecté")
        } else {
          console.log("Client ldap Non connecté")
        }
        var response;
        try {
          await this.client.bind(this.config.bindDN, this.config.secret)
        
          const { searchEntries, searchReferences } = await this.client.search(this.config.baseDN, {
            scope: 'sub',
            filter: (query.bucket=='')?'(&(objectCategory=person)(objectClass=user)(mail=*)(sAMAccountName=*))':`${query.bucket}`,
          })
          response = searchEntries
        } catch (ex) {
          throw ex;
        } finally {
          await this.client.unbind()
        }
      
      console.log("Ldap users :",response)
      
      return response
    })
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: AdLdapIntegration
  }
}
