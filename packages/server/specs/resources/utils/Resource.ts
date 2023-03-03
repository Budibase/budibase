type Example = {
  [key: string]: {
    [key: string]: any
  }
}

type Schema = {
  [key: string]: {
    [key: string]: any
  }
}

export default class Resource {
  examples: Example
  schemas: Schema

  constructor() {
    this.examples = {}
    this.schemas = {}
  }

  setExamples(examples: Example) {
    this.examples = examples
    return this
  }

  setSchemas(schemas: Schema) {
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
