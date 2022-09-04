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
      read: {
        type: QueryType.FIELDS,
        fields: {
          bucket: {
            type: "string",
            required: true,
          },
        },
      },
    },
  }

  class AdLdapIntegration implements IntegrationBase {
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


    


   
    async read(query: { bucket: string }) {
     
        
        console.log("Client crée :",this.client)
        
        if (this.client.isConnected) {
          console.log("Client ldap connecté")
        } else {
          console.log("Client ldap Non connecté")
        }
        var response = null;
        try {
          await this.client.bind(this.config.bindDN, this.config.secret)
        
          const { searchEntries, searchReferences } = await this.client.search(this.config.baseDN, {
            scope: 'sub',
            filter: (query.bucket=='')?'(&(objectCategory=person)(objectClass=user)(mail=*)(sAMAccountName=*))':`${query.bucket}`,
          })
          response = JSON.stringify(searchEntries)
         
        } catch (ex) {
          throw new Error(`AD Ldap error: ${ex}`)
        } finally {
          await this.client.unbind()
        }
      
      
      
      return response
    
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: AdLdapIntegration
  }
}
