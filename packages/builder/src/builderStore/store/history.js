import * as jsonpatch from "fast-json-patch/index.mjs"
import { writable, derived, get } from "svelte/store"

const Operations = {
  Add: "Add",
  Delete: "Delete",
  Change: "Change",
}

const initialState = {
  history: [],
  position: 0,
  loading: false,
}

export const createHistoryStore = () => {
  const store = writable(initialState)
  const derivedStore = derived(store, $store => {
    return {
      ...$store,
      canUndo: $store.position > 0,
      canRedo: $store.position < $store.history.length,
    }
  })
  let getFn
  let selectFn
  let saveFn
  let deleteFn

  const startLoading = () => {
    store.update(state => {
      state.loading = true
      return state
    })
  }

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
   * Wraps the getter function, which retrieves a doc by ID synchronously
   * @param fn the getter function
   */
  const wrapGet = fn => {
    getFn = fn
    return fn
  }

  /**
   * Wraps the select function, which selects a doc by ID synchronously.
   * Optionally used to ensure changed docs are "selected" again so that changes
   * are visible.
   * @param fn the select function
   */
  const wrapSelect = fn => {
    selectFn = fn
    return fn
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
  const wrapSave = fn => {
    saveFn = async (doc, operationId) => {
      // Only works on a single doc at a time
      if (!doc || Array.isArray(doc)) {
        return
      }
      const oldDoc = getFn(doc._id)
      const newDoc = jsonpatch.deepClone(await fn(doc))

      // Store the change
      if (!oldDoc) {
        saveOperation({
          type: Operations.Add,
          doc: newDoc,
          id: operationId,
        })
      } else {
        saveOperation({
          type: Operations.Change,
          forwardPatch: jsonpatch.compare(oldDoc, doc),
          backwardsPatch: jsonpatch.compare(doc, oldDoc),
          doc: newDoc,
          id: operationId,
        })
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
  const wrapDelete = fn => {
    deleteFn = async (doc, operationId) => {
      // Only works on a single doc at a time
      if (!doc || Array.isArray(doc)) {
        return
      }

      const oldDoc = jsonpatch.deepClone(doc)
      await fn(doc)
      saveOperation({
        type: Operations.Delete,
        doc: oldDoc,
        id: operationId,
      })
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
    const { canUndo, history, position } = get(derivedStore)
    if (!canUndo) {
      return
    }
    const operation = history[position - 1]
    if (!operation) {
      return
    }
    startLoading()

    // Update state immediately to prevent further clicks and to prevent bad
    // history in the event of an update failing
    store.update(state => {
      return {
        ...state,
        position: state.position - 1,
      }
    })

    // Undo the operation
    // Undo ADD
    if (operation.type === Operations.Add) {
      await deleteFn(operation.doc, operation.id)
    }

    // Undo DELETE
    else if (operation.type === Operations.Delete) {
      // Delete the _rev from the deleted doc so that we can save it as a new
      // doc again without conflicts
      let doc = jsonpatch.deepClone(operation.doc)
      delete doc._rev
      await saveFn(doc, operation.id)
    }

    // Undo CHANGE
    else {
      // Get the current doc and apply the backwards patch on top of it
      let doc = jsonpatch.deepClone(getFn(operation.doc._id))
      jsonpatch.applyPatch(doc, jsonpatch.deepClone(operation.backwardsPatch))
      await saveFn(doc, operation.id)
    }

    // Ensure the changed doc is selected
    if (operation.doc?._id && selectFn) {
      selectFn(operation.doc._id)
    }

    stopLoading()
  }

  /**
   * Asynchronously redoes the previous undo.
   * Optionally selects the changed document so that changes are visible.
   * @returns {Promise<void>}
   */
  const redo = async () => {
    // Sanity checks
    const { canRedo, history, position } = get(derivedStore)
    if (!canRedo) {
      return
    }
    const operation = history[position]
    if (!operation) {
      return
    }
    startLoading()

    // Update state immediately to prevent further clicks and to prevent bad
    // history in the event of an update failing
    store.update(state => {
      return {
        ...state,
        position: state.position + 1,
      }
    })

    // Redo the operation
    // Redo ADD
    if (operation.type === Operations.Add) {
      // Delete the _rev from the deleted doc so that we can save it as a new
      // doc again without conflicts
      let doc = jsonpatch.deepClone(operation.doc)
      delete doc._rev
      await saveFn(doc, operation.id)
    }

    // Redo DELETE
    else if (operation.type === Operations.Delete) {
      await deleteFn(operation.doc, operation.id)
    }

    // Redo CHANGE
    else {
      // Get the current doc and apply the forwards patch on top of it
      let doc = jsonpatch.deepClone(getFn(operation.doc._id))
      jsonpatch.applyPatch(doc, jsonpatch.deepClone(operation.forwardPatch))
      await saveFn(doc, operation.id)
    }

    // Ensure the changed doc is selected
    if (operation.doc?._id && selectFn) {
      selectFn(operation.doc._id)
    }

    stopLoading()
  }

  return {
    subscribe: derivedStore.subscribe,
    wrapGet,
    wrapSelect,
    wrapSave,
    wrapDelete,
    reset,
    undo,
    redo,
  }
}
