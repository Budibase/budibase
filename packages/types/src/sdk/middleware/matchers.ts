export interface EndpointMatcher {
  /**
   * The HTTP Path. e.g. /api/things/:thingId
   */
  route: string
  /**
   * The HTTP Verb. e.g. GET, POST, etc.
   * ALL is also accepted to cover all verbs.
   */
  method: string
  /**
   * The route must match exactly - not just begins with
   */
  strict?: boolean
}

export interface RegexMatcher {
  regex: RegExp
  method: string
  strict: boolean
  route: string
}
