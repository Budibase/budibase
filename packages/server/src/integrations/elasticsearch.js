const { Client } = require("@elastic/elasticsearch")

const SCHEMA = {
  datasource: {
    url: {
      type: "string",
      required: true,
      default: "localhost",
    },
    index: {
      type: "string",
      required: true,
    },
  },
  query: {
    json: {
      type: "json",
      required: true,
    },
  },
}

class ElasticSearchIntegration {
  constructor(config) {
    this.config = config
    this.client = new Client({ node: config.url })
  }

  async read() {
    try {
      const result = await this.client.search({
        index: this.config.index,
        body: JSON.parse(this.config.query),
      })
      return result.body.hits.hits.map(({ _source }) => _source)
    } catch (err) {
      console.error("Error querying elasticsearch", err)
      throw err
    } finally {
      await this.client.close()
    }
  }
}

module.exports = {
  schema: SCHEMA,
  integration: ElasticSearchIntegration,
}
