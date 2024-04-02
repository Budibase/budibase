import * as jsonpatch from "fast-json-patch/index.mjs"
import { writable, derived, get } from "svelte/store"

export const Operations = {
  Add: "Add",
  Delete: "Delete",
  Change: "Change",
}

export const initialState = {
  history: [],
  position: 0,
  loading: false,
}

export const createHistoryStore = ({
  getDoc,
  selectDoc,
  beforeAction,
  afterAction,
}) => {
  // Use a derived store to check if we are able to undo or redo any operations
  const store = writable(initialState)
  const derivedStore = derived(store, $store => {
    return {
      ...$store,
      canUndo: $store.position > 0,
      canRedo: $store.position < $store.history.length,
    }
  })

  // Wrapped versions of essential functions which we call ourselves when using
  // undo and redo
  let saveFn
  let deleteFn

  /**
   * Internal util to set the loading flag
   */
  const startLoading = () => {
    store.update(state => {
      state.loading = true
      return state
    })
  }

  /**
   * Internal util to unset the loading flag
   */
  const stopLoading = () => {
    store.update(state => {
      state.loading = false
      return state
    })
  }

  /**
   * Resets history state
   */
  const reset = () => {
    store.set(initialState)
  }

  /**
   * Adds or updates an operation in history.
   * For internal use only.
   * @param operation the operation to save
   */
  const saveOperation = operation => {
    store.update(state => {
      // Update history
      let history = state.history
      let position = state.position
      if (!operation.id) {
        // Every time a new operation occurs we discard any redo potential
        operation.id = Math.random()
        history = [...history.slice(0, state.position), operation]
        position += 1
      } else {
        // If this is a redo/undo of an existing operation, just update history
        // to replace the doc object as revisions may have changed
        const idx = history.findIndex(op => op.id === operation.id)
        history[idx].doc = operation.doc
      }
      return { history, position }
    })
  }

  /**
   * Wraps the save function, which asynchronously updates a doc.
   * The returned function is an enriched version of the real save function so
   * that we can control history.
   * @param fn the save function
   * @returns {function} a wrapped version of the save function
   */
  const wrapSaveDoc = fn => {
    saveFn = async (doc, operationId) => {
      // Only works on a single doc at a time
      if (!doc || Array.isArray(doc)) {
        return
      }
      startLoading()
      try {
        const oldDoc = getDoc(doc._id)
        const newDoc = jsonpatch.deepClone(await fn(doc))

        // Store the change
        if (!oldDoc) {
          // If no old doc, this is an add operation
          saveOperation({
            type: Operations.Add,
            doc: newDoc,
            id: operationId,
          })
        } else {
          // Otherwise this is a change operation
          saveOperation({
            type: Operations.Change,
            forwardPatch: jsonpatch.compare(oldDoc, doc),
            backwardsPatch: jsonpatch.compare(doc, oldDoc),
            doc: newDoc,
            id: operationId,
          })
        }
        stopLoading()
        return newDoc
      } catch (error) {
        // We want to allow errors to propagate up to normal handlers, but we
        // want to stop loading first
        stopLoading()
        throw error
      }
    }
    return saveFn
  }

  /**
   * Wraps the delete function, which asynchronously deletes a doc.
   * The returned function is an enriched version of the real delete function so
   * that we can control history.
   * @param fn the delete function
   * @returns {function} a wrapped version of the delete function
   */
  const wrapDeleteDoc = fn => {
    deleteFn = async (doc, operationId) => {
      // Only works on a single doc at a time
      if (!doc || Array.isArray(doc)) {
        return
      }
      startLoading()
      try {
        const oldDoc = jsonpatch.deepClone(doc)
        await fn(doc)
        saveOperation({
          type: Operations.Delete,
          doc: oldDoc,
          id: operationId,
        })
        stopLoading()
      } catch (error) {
        // We want to allow errors to propagate up to normal handlers, but we
        // want to stop loading first
        stopLoading()
        throw error
      }
    }
    return deleteFn
  }

  /**
   * Asynchronously undoes the previous operation.
   * Optionally selects the changed document so that changes are visible.
   * @returns {Promise<void>}
   */
  const undo = async () => {
    // Sanity checks
    const { canUndo, history, position, loading } = get(derivedStore)
    if (!canUndo || loading) {
      return
    }
    const operation = history[position - 1]
    if (!operation) {
      return
    }
    startLoading()

    // Before hook
    await beforeAction?.(operation)

    // Update state immediately to prevent further clicks and to prevent bad
    // history in the event of an update failing
    store.update(state => {
      return {
        ...state,
        position: state.position - 1,
      }
    })

    // Undo the operation
    try {
      // Undo ADD
      if (operation.type === Operations.Add) {
        // Try to get the latest doc version to delete
        const latestDoc = getDoc(operation.doc._id)
        const doc = latestDoc || operation.doc
        await deleteFn(doc, operation.id)
      }

      // Undo DELETE
      else if (operation.type === Operations.Delete) {
        // Delete the _rev from the deleted doc so that we can save it as a new
        // doc again without conflicts
        let doc = jsonpatch.deepClone(operation.doc)
        delete doc._rev
        const created = await saveFn(doc, operation.id)
        selectDoc?.(created?._id || doc._id)
      }

      // Undo CHANGE
      else {
        // Get the current doc and apply the backwards patch on top of it
        let doc = jsonpatch.deepClone(getDoc(operation.doc._id))
        if (doc) {
          jsonpatch.applyPatch(
            doc,
            jsonpatch.deepClone(operation.backwardsPatch)
          )
          await saveFn(doc, operation.id)
          selectDoc?.(doc._id)
        }
      }
      stopLoading()
    } catch (error) {
      stopLoading()
      throw error
    }

    // After hook
    await afterAction?.(operation)
  }

  /**
   * Asynchronously redoes the previous undo.
   * Optionally selects the changed document so that changes are visible.
   * @returns {Promise<void>}
   */
  const redo = async () => {
    // Sanity checks
    const { canRedo, history, position, loading } = get(derivedStore)
    if (!canRedo || loading) {
      return
    }
    const operation = history[position]
    if (!operation) {
      return
    }
    startLoading()

    // Before hook
    await beforeAction?.(operation)

    // Update state immediately to prevent further clicks and to prevent bad
    // history in the event of an update failing
    store.update(state => {
      return {
        ...state,
        position: state.position + 1,
      }
    })

    // Redo the operation
    try {
      // Redo ADD
      if (operation.type === Operations.Add) {
        // Delete the _rev from the deleted doc so that we can save it as a new
        // doc again without conflicts
        let doc = jsonpatch.deepClone(operation.doc)
        delete doc._rev
        const created = await saveFn(doc, operation.id)
        selectDoc?.(created?._id || doc._id)
      }

      // Redo DELETE
      else if (operation.type === Operations.Delete) {
        // Try to get the latest doc version to delete
        const latestDoc = getDoc(operation.doc._id)
        const doc = latestDoc || operation.doc
        await deleteFn(doc, operation.id)
      }

      // Redo CHANGE
      else {
        // Get the current doc and apply the forwards patch on top of it
        let doc = jsonpatch.deepClone(getDoc(operation.doc._id))
        if (doc) {
          jsonpatch.applyPatch(doc, jsonpatch.deepClone(operation.forwardPatch))
          await saveFn(doc, operation.id)
          selectDoc?.(doc._id)
        }
      }
      stopLoading()
    } catch (error) {
      stopLoading()
      throw error
    }

    // After hook
    await afterAction?.(operation)
  }

  return {
    subscribe: derivedStore.subscribe,
    wrapSaveDoc,
    wrapDeleteDoc,
    reset,
    undo,
    redo,
  }
}
