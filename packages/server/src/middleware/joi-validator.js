function validate(schema, property) {
  // Return a Koa middleware function
  return (ctx, next) => {
    if (schema) {
      const { error } = schema.validate(ctx[property])
      if (error) {
        ctx.throw(400, `Invalid ${property} - ${error.message}`)
      }
    }
    return next()
  }
}

module.exports.body = schema => {
  return validate(schema, "body")
}
