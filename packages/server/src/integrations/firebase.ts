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
    serviceAccount?: string
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
      serviceAccount: {
        type: DatasourceFieldTypes.JSON,
        required: false,
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
      filterField: {
        displayName: "Filter field",
        type: DatasourceFieldTypes.STRING,
        required: false,
      },
      filter: {
        displayName: "Filter comparison",
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
      filterValue: {
        displayName: "Filter value",
        type: DatasourceFieldTypes.STRING,
        required: false,
      },
    },
  }

  class FirebaseIntegration implements IntegrationBase {
    private config: FirebaseConfig
    private client: Firestore

    constructor(config: FirebaseConfig) {
      this.config = config
      if (config.serviceAccount) {
        const serviceAccount = JSON.parse(config.serviceAccount)
        this.client = new Firestore({
          projectId: serviceAccount.project_id,
          credentials: {
            client_email: serviceAccount.client_email,
            private_key: serviceAccount.private_key,
          },
        })
      } else {
        this.client = new Firestore({
          projectId: config.projectId,
          credentials: {
            client_email: config.email,
            private_key: config.privateKey,
          },
        })
      }
    }

    async create(query: { json: object; extra: { [key: string]: string } }) {
      try {
        const documentReference = this.client
          .collection(query.extra.collection)
          .doc()
        await documentReference.set({ ...query.json, id: documentReference.id })
        const snapshot = await documentReference.get()
        return snapshot.data()
      } catch (err) {
        console.error("Error writing to Firestore", err)
        throw err
      }
    }

    async read(query: { json: object; extra: { [key: string]: string } }) {
      try {
        let snapshot
        const collectionRef = this.client.collection(query.extra.collection)
        if (
          query.extra.filterField &&
          query.extra.filter &&
          query.extra.filterValue
        ) {
          snapshot = await collectionRef
            .where(
              query.extra.filterField,
              query.extra.filter as WhereFilterOp,
              query.extra.filterValue
            )
            .get()
        } else {
          snapshot = await collectionRef.get()
        }
        const result: any[] = []
        snapshot.forEach(doc => result.push(doc.data()))

        return result
      } catch (err) {
        console.error("Error querying Firestore", err)
        throw err
      }
    }

    async update(query: {
      json: Record<string, any>
      extra: { [key: string]: string }
    }) {
      try {
        await this.client
          .collection(query.extra.collection)
          .doc(query.json.id)
          .update(query.json)

        return (
          await this.client
            .collection(query.extra.collection)
            .doc(query.json.id)
            .get()
        ).data()
      } catch (err) {
        console.error("Error writing to Firestore", err)
        throw err
      }
    }

    async delete(query: {
      json: { id: string }
      extra: { [key: string]: string }
    }) {
      try {
        await this.client
          .collection(query.extra.collection)
          .doc(query.json.id)
          .delete()
        return true
      } catch (err) {
        console.error("Error deleting from Firestore", err)
        throw err
      }
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: FirebaseIntegration,
  }
}
