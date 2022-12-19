class Resource {
  constructor() {
    this.examples = {}
    this.schemas = {}
  }

  setExamples(examples) {
    this.examples = examples
    return this
  }

  setSchemas(schemas) {
    this.schemas = schemas
    return this
  }

  getExamples() {
    return this.examples
  }

  getSchemas() {
    return this.schemas
  }
}

module.exports = Resource
