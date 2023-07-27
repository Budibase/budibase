export interface APIRequestOpts {
  // in some cases we need to bypass the expect assertion in an api call
  // e.g. during global setup where jest is not available
  doExpect?: boolean
  status?: number
}
