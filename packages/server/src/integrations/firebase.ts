import {
  DatasourceFieldTypes,
  Integration,
  QueryTypes,
} from "../definitions/datasource"
import { IntegrationBase } from "./base/IntegrationBase"
import { Firestore, WhereFilterOp } from "@google-cloud/firestore"

module Firebase {
  interface FirebaseConfig {
    email: string
    privateKey: string
    projectId: string
  }

  const SCHEMA: Integration = {
    docs: "https://firebase.google.com/docs/firestore/quickstart",
    friendlyName: "Firestore",
    description:
      "Cloud Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud.",
    datasource: {
      email: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      privateKey: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      projectId: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
    },
    query: {
      create: {
        type: QueryTypes.JSON,
      },
      read: {
        type: QueryTypes.JSON,
      },
      update: {
        type: QueryTypes.JSON,
      },
      delete: {
        type: QueryTypes.JSON,
      },
    },
    extra: {
      collection: {
        displayName: "Collection",
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      filter: {
        displayName: "Filter query",
        type: DatasourceFieldTypes.LIST,
        required: false,
        data: {
          read: [
            "==",
            "<",
            "<=",
            "==",
            "!=",
            ">=",
            ">",
            "array-contains",
            "in",
            "not-in",
            "array-contains-any",
          ],
        },
      },
      queryValue: {
        displayName: "Query value",
        type: DatasourceFieldTypes.STRING,
        required: false,
      },
    },
  }

  class FirebaseIntegration implements IntegrationBase {
    private config: FirebaseConfig
    private db: Firestore

    constructor(config: FirebaseConfig) {
      this.config = config
      this.db = new Firestore({
        projectId: config.projectId,
        credential: {
          clientEmail: config.email,
          privateKey: config.privateKey,
        },
      })
    }

    async create(query: { json: object; extra: { [key: string]: string } }) {
      try {
        return await this.db.collection(query.extra.collection).add(query.json)
      } catch (err) {
        console.error("Error writing to Firestore", err)
        throw err
      }
    }

    async read(query: {
      field: string
      opStr: WhereFilterOp
      value: any
      extra: { [key: string]: string }
    }) {
      try {
        const snapshot = await this.db
          .collection(query.extra.collection)
          .where(query.field, query.opStr, query.value)
          .get()
        const result: any[] = []
        snapshot.forEach(doc => result.push(doc.data()))

        return result
      } catch (err) {
        console.error("Error querying Firestore", err)
        throw err
      }
    }

    async update(query: {
      id: string
      json: object
      extra: { [key: string]: string }
    }) {
      try {
        return await this.db
          .collection(query.extra.collection)
          .doc(query.id)
          .update(query.json)
      } catch (err) {
        console.error("Error writing to mongodb", err)
        throw err
      }
    }

    async delete(query: { id: string; extra: { [key: string]: string } }) {
      try {
        return await this.db
          .collection(query.extra.collection)
          .doc(query.id)
          .delete()
      } catch (err) {
        console.error("Error writing to mongodb", err)
        throw err
      }
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: FirebaseIntegration,
  }
}
