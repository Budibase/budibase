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
}

export interface RegexMatcher {
  regex: RegExp
  method: string
  route: string
}
