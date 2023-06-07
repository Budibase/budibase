export const object = (props: any, opts?: any) => {
  const base = {
    type: "object",
    properties: props,
    ...opts,
  }
  if (Object.keys(props).length > 0 && (!opts || !opts.required)) {
    base.required = Object.keys(props)
  }
  return base
}
