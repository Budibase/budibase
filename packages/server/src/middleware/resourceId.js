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
      if (main != null && ctx.request[parameter][main]) {
        ctx.resourceId = ctx.request[parameter][main]
      }
      if (sub != null && ctx.request[parameter][sub]) {
        ctx.subResourceId = ctx.request[parameter][sub]
      }
      next()
    }
  }
}

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
