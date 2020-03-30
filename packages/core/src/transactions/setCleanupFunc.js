import { cleanup } from "./cleanup"

export const setCleanupFunc = (app, cleanupTransactions) => {
  if (cleanupTransactions) {
    app.cleanupTransactions = cleanupTransactions
    return
  }

  if (!app.cleanupTransactions || app.cleanupTransactions.isDefault) {
    const newCleanup = async () => cleanup(app)
    newCleanup.isDefault = true
    app.cleanupTransactions = newCleanup
  }
}
