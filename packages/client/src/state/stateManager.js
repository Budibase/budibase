import {
  isEventType,
  eventHandlers,
  EVENT_TYPE_MEMBER_NAME,
} from "./eventHandlers"
import { bbFactory } from "./bbComponentApi"
import { getState } from "./getState"
import { attachChildren } from "../render/attachChildren"

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
  propName === "_code" ||
  propName === "_codeMeta"

export const createStateManager = ({
  store,
  coreApi,
  rootPath,
  frontendDefinition,
  componentLibraries,
  uiFunctions,
  onScreenSlotRendered,
}) => {
  let handlerTypes = eventHandlers(store, coreApi, rootPath)
  let currentState

  // any nodes that have props that are bound to the store
  let nodesBoundByProps = []

  // any node whose children depend on code, that uses the store
  let nodesWithCodeBoundChildren = []

  const getCurrentState = () => currentState
  const registerBindings = _registerBindings(
    nodesBoundByProps,
    nodesWithCodeBoundChildren
  )
  const bb = bbFactory({
    store,
    getCurrentState,
    frontendDefinition,
    componentLibraries,
    uiFunctions,
    onScreenSlotRendered,
  })

  const setup = _setup(handlerTypes, getCurrentState, registerBindings, bb)

  const unsubscribe = store.subscribe(
    onStoreStateUpdated({
      setCurrentState: s => (currentState = s),
      getCurrentState,
      nodesWithCodeBoundChildren,
      nodesBoundByProps,
      uiFunctions,
      componentLibraries,
      onScreenSlotRendered,
      setupState: setup,
    })
  )

  return {
    setup,
    destroy: () => unsubscribe(),
    getCurrentState,
    store,
  }
}

const onStoreStateUpdated = ({
  setCurrentState,
  getCurrentState,
  nodesWithCodeBoundChildren,
  nodesBoundByProps,
  uiFunctions,
  componentLibraries,
  onScreenSlotRendered,
  setupState,
}) => s => {
  setCurrentState(s)

  // the original array gets changed by components' destroy()
  // so we make a clone and check if they are still in the original
  const nodesWithBoundChildren_clone = [...nodesWithCodeBoundChildren]
  for (let node of nodesWithBoundChildren_clone) {
    if (!nodesWithCodeBoundChildren.includes(node)) continue
    attachChildren({
      uiFunctions,
      componentLibraries,
      treeNode: node,
      onScreenSlotRendered,
      setupState,
      getCurrentState,
    })(node.rootElement, { hydrate: true, force: true })
  }

  for (let node of nodesBoundByProps) {
    setNodeState(s, node)
  }
}

const _registerBindings = (nodesBoundByProps, nodesWithCodeBoundChildren) => (
  node,
  bindings
) => {
  if (bindings.length > 0) {
    node.bindings = bindings
    nodesBoundByProps.push(node)
    const onDestroy = () => {
      nodesBoundByProps = nodesBoundByProps.filter(n => n === node)
      node.onDestroy = node.onDestroy.filter(d => d === onDestroy)
    }
    node.onDestroy.push(onDestroy)
  }
  if (
    node.props._children &&
    node.props._children.filter(c => c._codeMeta && c._codeMeta.dependsOnStore)
      .length > 0
  ) {
    nodesWithCodeBoundChildren.push(node)
    const onDestroy = () => {
      nodesWithCodeBoundChildren = nodesWithCodeBoundChildren.filter(
        n => n === node
      )
      node.onDestroy = node.onDestroy.filter(d => d === onDestroy)
    }
    node.onDestroy.push(onDestroy)
  }
}

const setNodeState = (storeState, node) => {
  if (!node.component) return
  const newProps = { ...node.bindings.initialProps }

  for (let binding of node.bindings) {
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

const _setup = (
  handlerTypes,
  getCurrentState,
  registerBindings,
  bb
) => node => {
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
          } else if (takeStateFromContext(paramValue)) {
            const val = getState(
              context,
              paramValue[BB_STATE_BINDINGPATH],
              paramValue[BB_STATE_FALLBACK]
            )
            resolvedParams[paramName] = () => val
          } else if (takeStateFromStore(paramValue)) {
            resolvedParams[paramName] = () =>
              getState(
                getCurrentState(),
                paramValue[BB_STATE_BINDINGPATH],
                paramValue[BB_STATE_FALLBACK]
              )
            continue
          } else if (takeStateFromEventParameters(paramValue)) {
            resolvedParams[paramName] = eventContext => {
              getState(
                eventContext,
                paramValue[BB_STATE_BINDINGPATH],
                paramValue[BB_STATE_FALLBACK]
              )
            }
          }
        }

        handlerInfo.parameters = resolvedParams
        handlersInfos.push(handlerInfo)
      }

      if (handlersInfos.length === 0) initialProps[propName] = doNothing
      else {
        initialProps[propName] = async context => {
          for (let handlerInfo of handlersInfos) {
            const handler = makeHandler(handlerTypes, handlerInfo)
            await handler(context)
          }
        }
      }
    }
  }

  registerBindings(node, storeBoundProps)

  const setup = _setup(handlerTypes, getCurrentState, registerBindings, bb)
  initialProps._bb = bb(node, setup)

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
