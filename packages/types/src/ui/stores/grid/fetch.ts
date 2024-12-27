export interface UIFetchAPI {
  getInitialData: () => Promise<void>
  nextPage: () => Promise<void>
}
