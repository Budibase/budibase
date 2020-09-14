import { writable } from "svelte/store"

// we assume that the reference to this state object
// will remain for the life of the application
const rootState = {}
const rootStore = writable(rootState)
const contextStores = {}

// contextProviderId is the component id that provides the data for the context
const contextStoreKey = (dataProviderId, childIndex) =>
  `${dataProviderId}${childIndex >= 0 ? ":" + childIndex : ""}`

// creates a store for a datacontext (e.g. each item in a list component)
// overrides store if already exists
const create = (data, dataProviderId, childIndex, parentContextStoreId) => {
  const key = contextStoreKey(dataProviderId, childIndex)
  const state = { data }

  // add reference to parent state object,
  // so we can use bindings like state.parent.parent
  // (if no parent, then parent is rootState )
  state.parent = parentContextStoreId
    ? contextStores[parentContextStoreId].state
    : rootState

  contextStores[key] = {
    store: writable(state),
    subscriberCount: 0,
    state,
    parentContextStoreId,
  }

  return key
}

const subscribe = (subscription, storeKey) => {
  if (!storeKey) {
    return rootStore.subscribe(subscription)
  }
  const contextStore = contextStores[storeKey]

  // we are subscribing to multiple stores,
  // we dont want to run our listener for every subscription, the first time
  // as this could repeatedly run $set on the same component
  // ... which already has its initial properties set properly
  const ignoreFirstSubscription = () => {
    let hasRunOnce = false
    return () => {
      if (hasRunOnce) subscription(contextStore.state)
      hasRunOnce = true
    }
  }

  const unsubscribes = [rootStore.subscribe(ignoreFirstSubscription())]

  // we subscribe to all stores in the hierarchy
  const ancestorSubscribe = ctxStore => {
    // unsubscribe func returned by svelte store
    const svelteUnsub = ctxStore.store.subscribe(ignoreFirstSubscription())

    // we wrap the svelte unsubscribe, so we can
    // cleanup stores when they are no longer subscribed to
    const unsub = () => {
      ctxStore.subscriberCount = contextStore.subscriberCount - 1
      // when no subscribers left, we delete the store
      if (ctxStore.subscriberCount === 0) {
        delete ctxStore[storeKey]
      }
      svelteUnsub()
    }
    unsubscribes.push(unsub)
    if (ctxStore.parentContextStoreId) {
      ancestorSubscribe(contextStores[ctxStore.parentContextStoreId])
    }
  }

  ancestorSubscribe(contextStore)

  // our final unsubscribe function calls unsubscribe on all stores
  return () => unsubscribes.forEach(u => u())
}

const findStore = (dataProviderId, childIndex) =>
  dataProviderId
    ? contextStores[contextStoreKey(dataProviderId, childIndex)].store
    : rootStore

const update = (updatefunc, dataProviderId, childIndex) =>
  findStore(dataProviderId, childIndex).update(updatefunc)

const set = (value, dataProviderId, childIndex) =>
  findStore(dataProviderId, childIndex).set(value)

const getState = contextStoreKey =>
  contextStoreKey ? contextStores[contextStoreKey].state : rootState

const getStore = contextStoreKey =>
  contextStoreKey ? contextStores[contextStoreKey] : rootStore

export default {
  subscribe,
  update,
  set,
  getState,
  create,
  contextStoreKey,
  getStore,
}
