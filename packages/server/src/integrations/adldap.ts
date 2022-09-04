import { Integration, QueryType, IntegrationBase } from "@budibase/types"
import { IClientConfig, Client } from "ldap-ts-client";


module AdLdapModule {
  

  /*interface AdLdapConfig {
    url: string
    bindDN: string
    secret: string
    baseDN: string
  }*/

  const SCHEMA: Integration = {
    docs: "https://github.com/saostad/ldap-ts-client#readme",
    description:
      "LDAP Client to connect your Active Directory LDAP Server.",
    friendlyName: "AD Ldap",
    type: "Object store",
    datasource: {
      url: {
        type: "string",
        required: false,
        default: "ldap://domain.com",
      },
      bindDN: {
        type: "password",
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
    private readonly config: IClientConfig
    private client: any

    constructor(config: IClientConfig) {
      this.config = config
      

      this.client = new Client(this.config)
    }

    async read(query: { bucket: string }) {
      const response = await this.client.queryAttributes({
        attributes: [query.bucket],
        options: {
          filter:
            "(&(|(objectClass=user)(objectClass=person))(!(objectClass=computer))(!(objectClass=group)))",
          scope: "sub",
          paged: true,
        },
      });
      
      // always free-Up after you done the job!
      this.client.unbind();
      return response
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: AdLdapIntegration,
  }
}
