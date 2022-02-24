exports.object = (props, opts) => {
  return {
    type: "object",
    properties: props,
    ...opts,
  }
}
