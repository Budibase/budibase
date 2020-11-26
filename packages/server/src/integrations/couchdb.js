// const PouchDB = require("pouchdb")

// const COUCHDB_OPTIONS = {
//   url: {
//     type: "string",
//     required: true,
//     default: "localhost",
//   },
//   database: {
//     type: "string",
//     required: true,
//   },
//   // query: {
//   //   type: "query",
//   //   required: true,
//   // },
// }

// class ElasticSearchIntegration {
//   constructor(config) {
//     this.config = config
//     this.client = new Client({ node: config.url })
//   }

//   async query() {
//     try {
//       const result = await this.client.search({
//         index: this.config.index,
//         body: JSON.parse(this.config.query),
//       })
//       return result
//     } finally {
//       await this.client.close()
//     }
//   }
// }

// module.exports = {
//   schema: ELASTICSEARCH_OPTIONS,
//   integration: ElasticSearchIntegration,
// }


