import { derived, get, type Writable } from "svelte/store"
import { createLocalStorageStore } from "@budibase/frontend-core"
import { Helpers } from "@budibase/bbui"
import type { Row } from "@budibase/types"
import { API } from "@/api"
import { dataSourceStore } from "./dataSource"
import { notificationStore } from "./notification"

export type OfflineSubmissionStatus = "pending" | "failed"

export interface OfflineSubmission {
  id: string
  row: Row
  createdAt: number
  status: OfflineSubmissionStatus
  error?: string
}

interface SaveRowError {
  status?: number
  message?: string
}

const NETWORK_ERROR_MESSAGE = "Failed to send request"

export const isNetworkError = (error: SaveRowError | undefined) =>
  !navigator.onLine || error?.message === NETWORK_ERROR_MESSAGE

// Errors which may resolve without the user changing the submission, so the
// submission should stay pending rather than being marked as failed
const isRetryableError = (error: SaveRowError | undefined) =>
  isNetworkError(error) || error?.status === 401 || error?.status === 403

const createOfflineQueueStore = () => {
  const appId = window["##BUDIBASE_APP_ID##"] || "app"
  const store: Writable<OfflineSubmission[]> = createLocalStorageStore(
    `${appId}.offlineQueue`,
    []
  )
  let syncing = false

  const updateSubmission = (
    id: string,
    changes: Partial<Omit<OfflineSubmission, "id">>
  ) => {
    store.update(state =>
      state.map(submission =>
        submission.id === id ? { ...submission, ...changes } : submission
      )
    )
  }

  const enqueue = (row: Row) => {
    const submission: OfflineSubmission = {
      id: Helpers.uuid(),
      row,
      createdAt: Date.now(),
      status: "pending",
    }
    store.update(state => [...state, submission])
    return submission
  }

  const remove = (id: string) => {
    store.update(state => state.filter(submission => submission.id !== id))
  }

  const updateRow = (id: string, row: Row) => {
    updateSubmission(id, { row, status: "pending", error: undefined })
  }

  const retry = async (id: string) => {
    updateSubmission(id, { status: "pending", error: undefined })
    await sync()
  }

  const syncSubmission = async (submission: OfflineSubmission) => {
    try {
      await API.saveRow(submission.row, true)
      remove(submission.id)
      const sourceId = submission.row._viewId || submission.row.tableId
      await dataSourceStore.actions.invalidateDataSource(sourceId, {
        invalidateRelationships: true,
      })
      return true
    } catch (error) {
      const saveError = error as SaveRowError
      if (isRetryableError(saveError)) {
        return false
      }
      updateSubmission(submission.id, {
        status: "failed",
        error: saveError?.message || "Failed to save row",
      })
      return true
    }
  }

  // Submissions are synced in the order they were created, so that rows
  // depending on earlier rows are not saved first
  const sync = async () => {
    if (syncing || !navigator.onLine) {
      return
    }
    syncing = true
    let synced = 0
    try {
      const pending = get(store).filter(s => s.status === "pending")
      for (const submission of pending) {
        const handled = await syncSubmission(submission)
        if (!handled) {
          break
        }
        if (!get(store).some(s => s.id === submission.id)) {
          synced++
        }
      }
    } finally {
      syncing = false
    }
    if (synced) {
      notificationStore.actions.success(
        `${synced} offline submission${synced === 1 ? "" : "s"} synced`
      )
    }
  }

  const init = () => {
    window.addEventListener("online", sync)
    sync()
  }

  const derivedStore = derived(store, $store => ({
    submissions: $store,
    pendingCount: $store.filter(s => s.status === "pending").length,
    failedCount: $store.filter(s => s.status === "failed").length,
  }))

  return {
    subscribe: derivedStore.subscribe,
    actions: { init, enqueue, remove, updateRow, retry, sync },
  }
}

export const offlineQueueStore = createOfflineQueueStore()
