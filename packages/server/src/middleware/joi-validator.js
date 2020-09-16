function validate(schema, property) {
  // Return a Koa middleware function
  return (ctx, next) => {
    if (schema) {
      let params =
        ctx[property] != null
          ? ctx[property]
          : ctx.request[property] != null
          ? ctx.request[property]
          : null
      const { error } = schema.validate(params)
      if (error) {
        ctx.throw(400, `Invalid ${property} - ${error.message}`)
        return
      }
    }
    return next()
  }
}

module.exports.body = schema => {
  return validate(schema, "body")
}
