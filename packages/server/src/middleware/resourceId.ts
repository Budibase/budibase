class ResourceIdGetter {
  constructor(ctxProperty) {
    this.parameter = ctxProperty
    this.main = null
    this.sub = null
    return this
  }

  mainResource(field) {
    this.main = field
    return this
  }

  subResource(field) {
    this.sub = field
    return this
  }

  build() {
    const parameter = this.parameter,
      main = this.main,
      sub = this.sub
    return (ctx, next) => {
      const request = ctx.request[parameter] || ctx[parameter]
      if (request == null) {
        return next()
      }
      if (main != null && request[main]) {
        ctx.resourceId = request[main]
      }
      if (sub != null && request[sub]) {
        ctx.subResourceId = request[sub]
      }
      return next()
    }
  }
}

module.exports.ResourceIdGetter = ResourceIdGetter

module.exports.paramResource = main => {
  return new ResourceIdGetter("params").mainResource(main).build()
}

module.exports.paramSubResource = (main, sub) => {
  return new ResourceIdGetter("params")
    .mainResource(main)
    .subResource(sub)
    .build()
}

module.exports.bodyResource = main => {
  return new ResourceIdGetter("body").mainResource(main).build()
}

module.exports.bodySubResource = (main, sub) => {
  return new ResourceIdGetter("body")
    .mainResource(main)
    .subResource(sub)
    .build()
}
