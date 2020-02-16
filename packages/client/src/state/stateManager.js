import {
  isEventType,
  eventHandlers,
  EVENT_TYPE_MEMBER_NAME,
} from "./eventHandlers"

import { getState } from "./getState"

import {
  isBound,
  takeStateFromStore,
  takeStateFromContext,
  takeStateFromEventParameters,
  BB_STATE_FALLBACK,
  BB_STATE_BINDINGPATH,
  BB_STATE_BINDINGSOURCE,
} from "./isState"

const doNothing = () => {}
doNothing.isPlaceholder = true

const isMetaProp = propName =>
  propName === "_component" ||
  propName === "_children" ||
  propName === "_id" ||
  propName === "_style" ||
  propName === "_code"

export const createStateManager = (store, coreApi, rootPath) => {
  let handlerTypes = eventHandlers(store, coreApi, rootPath)
  let currentState
  let storeBindings = []
  const unsubscribe = store.subscribe(s => {
    currentState = s
    for (let binding of storeBindings) {
      setNodeState(currentState, binding)
    }
  })

  const getCurrentState = () => currentState
  const registerBindings = (node, bindings) => {
    storeBindings.push({ node, bindings })
  }

  return {
    setup: setup(handlerTypes, getCurrentState, registerBindings),
    destroy: () => unsubscribe(),
    getCurrentState,
    store,
  }
}

const setNodeState = (storeState, { node, bindings }) => {
  if (!node.component) return
  const newProps = { ...bindings.initialProps }

  for (let binding of bindings) {
    const val = getState(storeState, binding.path, binding.fallback)

    if (val === undefined && newProps[binding.propName] !== undefined) {
      delete newProps[binding.propName]
    }

    if (val !== undefined) {
      newProps[binding.propName] = val
    }
  }

  node.component.$set(newProps)
}

const setup = (handlerTypes, getCurrentState, registerBindings) => node => {
  const props = node.props
  const context = node.context || {}
  const initialProps = { ...props }
  const storeBoundProps = []
  const currentStoreState = getCurrentState()

  for (let propName in props) {
    if (isMetaProp(propName)) continue

    const val = props[propName]

    if (isBound(val) && takeStateFromStore(val)) {
      const path = BindingPath(val)
      const source = BindingSource(val)
      const fallback = BindingFallback(val)

      storeBoundProps.push({
        path,
        fallback,
        propName,
        source,
      })

      initialProps[propName] = !currentStoreState
        ? fallback
        : getState(
            currentStoreState,
            BindingPath(val),
            BindingFallback(val),
            BindingSource(val)
          )
    } else if (isBound(val) && takeStateFromContext(val)) {
      initialProps[propName] = !context
        ? val
        : getState(
            context,
            BindingPath(val),
            BindingFallback(val),
            BindingSource(val)
          )
    } else if (isEventType(val)) {
      const handlersInfos = []
      for (let e of val) {
        const handlerInfo = {
          handlerType: e[EVENT_TYPE_MEMBER_NAME],
          parameters: e.parameters,
        }
        const resolvedParams = {}
        for (let paramName in handlerInfo.parameters) {
          const paramValue = handlerInfo.parameters[paramName]
          if (!isBound(paramValue)) {
            resolvedParams[paramName] = () => paramValue
            continue
          }
          if (takeStateFromContext(paramValue)) {
            const val = getState(
              context,
              paramValue[BB_STATE_BINDINGPATH],
              paramValue[BB_STATE_FALLBACK]
            )
            resolvedParams[paramName] = () => val
            continue
          }
          if (takeStateFromStore(paramValue)) {
            resolvedParams[paramName] = () =>
              getState(
                getCurrentState(),
                paramValue[BB_STATE_BINDINGPATH],
                paramValue[BB_STATE_FALLBACK]
              )
            continue
          }
          if (takeStateFromEventParameters(paramValue)) {
            resolvedParams[paramName] = eventContext => {
              getState(
                eventContext,
                paramValue[BB_STATE_BINDINGPATH],
                paramValue[BB_STATE_FALLBACK]
              )
            }
          }
        }

        handlersInfos.push(handlerInfo)
      }

      if (handlersInfos.length === 0) initialProps[propName] = doNothing
      else {
        async context => {
          for (let handlerInfo of handlersInfos) {
            const handler = makeHandler(handlerTypes, handlerInfo)
            await handler(context)
          }
        }
      }
    }
  }

  registerBindings(node, storeBoundProps)

  return initialProps
}

const makeHandler = (handlerTypes, handlerInfo) => {
  const handlerType = handlerTypes[handlerInfo.handlerType]
  return context => {
    const parameters = {}
    for (let p in handlerInfo.parameters) {
      parameters[p] = handlerInfo.parameters[p](context)
    }
    handlerType.execute(parameters)
  }
}

const BindingPath = prop => prop[BB_STATE_BINDINGPATH]
const BindingFallback = prop => prop[BB_STATE_FALLBACK]
const BindingSource = prop => prop[BB_STATE_BINDINGSOURCE]
