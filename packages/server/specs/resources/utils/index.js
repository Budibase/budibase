exports.object = (props, opts) => {
  return {
    type: "object",
    properties: props,
    required: Object.keys(props),
    ...opts,
  }
}
