import {
  DatasourceFieldType,
  Integration,
  QueryType,
  IntegrationBase,
  DatasourceFeature,
  ConnectionInfo,
} from "@budibase/types"
import { Firestore, WhereFilterOp } from "@google-cloud/firestore"

interface FirebaseConfig {
  email: string
  privateKey: string
  projectId: string
  databaseId?: string
}

const SCHEMA: Integration = {
  docs: "https://firebase.google.com/docs/firestore/quickstart",
  friendlyName: "Firestore",
  type: "Non-relational",
  description:
    "Cloud Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud.",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    email: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    privateKey: {
      type: DatasourceFieldType.STRING,
      display: "Private Key",
      required: true,
    },
    projectId: {
      type: DatasourceFieldType.STRING,
      display: "Project ID",
      required: true,
    },
    databaseId: {
      type: DatasourceFieldType.STRING,
      display: "Database ID",
      required: false,
      default: "(default)",
      placeholder: "(default)",
    },
  },
  query: {
    create: {
      type: QueryType.JSON,
    },
    read: {
      type: QueryType.JSON,
    },
    update: {
      type: QueryType.JSON,
    },
    delete: {
      type: QueryType.JSON,
    },
  },
  extra: {
    collection: {
      displayName: "Collection",
      type: DatasourceFieldType.STRING,
      required: true,
    },
    filterField: {
      displayName: "Filter field",
      type: DatasourceFieldType.STRING,
      required: false,
    },
    filter: {
      displayName: "Filter comparison",
      type: DatasourceFieldType.LIST,
      required: false,
      data: {
        read: [
          "==",
          "<",
          "<=",
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
      type: DatasourceFieldType.STRING,
      required: false,
    },
  },
}

class FirebaseIntegration implements IntegrationBase {
  private config: FirebaseConfig
  private client: Firestore

  constructor(config: FirebaseConfig) {
    this.config = config
    this.client = new Firestore({
      projectId: config.projectId,
      databaseId: config.databaseId || "(default)",
      credentials: {
        client_email: config.email,
        private_key: config.privateKey?.replace(/\\n/g, "\n"),
      },
    })
  }

  async testConnection(): Promise<ConnectionInfo> {
    try {
      await this.client.listCollections()
      return { connected: true }
    } catch (e: any) {
      return {
        connected: false,
        error: e.message as string,
      }
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

export default {
  schema: SCHEMA,
  integration: FirebaseIntegration,
}
