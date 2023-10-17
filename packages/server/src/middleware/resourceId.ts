import { BBContext } from "@budibase/types"

export class ResourceIdGetter {
  parameter: string
  main: string | null
  sub: string | null

  constructor(ctxProperty: string) {
    this.parameter = ctxProperty
    this.main = null
    this.sub = null
    return this
  }

  mainResource(field: string) {
    this.main = field
    return this
  }

  subResource(field: string) {
    this.sub = field
    return this
  }

  build() {
    const parameter = this.parameter,
      main = this.main,
      sub = this.sub
    return (ctx: BBContext, next: any) => {
      // @ts-ignore
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

/** @deprecated we should use the authorizedResource middleware instead */
export function paramResource(main: string) {
  return new ResourceIdGetter("params").mainResource(main).build()
}

export function paramSubResource(main: string, sub: string) {
  return new ResourceIdGetter("params")
    .mainResource(main)
    .subResource(sub)
    .build()
}

export function bodyResource(main: string) {
  return new ResourceIdGetter("body").mainResource(main).build()
}

export function bodySubResource(main: string, sub: string) {
  return new ResourceIdGetter("body")
    .mainResource(main)
    .subResource(sub)
    .build()
}
