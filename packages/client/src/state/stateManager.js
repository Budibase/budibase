import {
  isEventType,
  eventHandlers,
  EVENT_TYPE_MEMBER_NAME,
} from "./eventHandlers"
import { bbFactory } from "./bbComponentApi"
import { getState } from "./getState"
import { attachChildren } from "../render/attachChildren"
import mustache from "mustache"

import { parseBinding } from "./parseBinding"

const doNothing = () => {}
doNothing.isPlaceholder = true

const isMetaProp = propName =>
  propName === "_component" ||
  propName === "_children" ||
  propName === "_id" ||
  propName === "_style" ||
  propName === "_code" ||
  propName === "_codeMeta" ||
  propName === "_styles"

export const createStateManager = ({
  store,
  appRootPath,
  frontendDefinition,
  componentLibraries,
  onScreenSlotRendered,
  routeTo,
}) => {
  let handlerTypes = eventHandlers(store, appRootPath, routeTo)
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
    onScreenSlotRendered,
  })

  const setup = _setup(handlerTypes, getCurrentState, registerBindings, bb)

  const unsubscribe = store.subscribe(
    onStoreStateUpdated({
      setCurrentState: s => (currentState = s),
      getCurrentState,
      nodesWithCodeBoundChildren,
      nodesBoundByProps,
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
  // nodesBoundByProps,
  componentLibraries,
  onScreenSlotRendered,
  setupState,
}) => state => {
  setCurrentState(state)

  // the original array gets changed by components' destroy()
  // so we make a clone and check if they are still in the original
  const nodesWithBoundChildren_clone = [...nodesWithCodeBoundChildren]
  for (let node of nodesWithBoundChildren_clone) {
    if (!nodesWithCodeBoundChildren.includes(node)) continue
    attachChildren({
      componentLibraries,
      treeNode: node,
      onScreenSlotRendered,
      setupState,
      getCurrentState,
    })(node.rootElement, { hydrate: true, force: true })
  }

  // for (let node of nodesBoundByProps) {
  //   setNodeState(state, node)
  // }
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

    const propValue = props[propName]

    // const binding = parseBinding(propValue)
    // const isBound = !!binding

    if (typeof propValue === "string") {
      initialProps[propName] = mustache.render(propValue, {
        state: currentStoreState,
        context
      })
    }

    // if (isBound) binding.propName = propName

    // if (isBound && binding.source === "state") {
    //   storeBoundProps.push(binding)

    //   initialProps[propName] = !currentStoreState
    //     ? binding.fallback
    //     : getState(
    //         currentStoreState,
    //         binding.path,
    //         binding.fallback,
    //         binding.source
    //       )
    // }

    // if (isBound && binding.source === "context") {
    //   initialProps[propName] = !context
    //     ? propValue
    //     : getState(context, binding.path, binding.fallback, binding.source)
    // }

    if (isEventType(propValue)) {
      const handlersInfos = []
      for (let event of propValue) {
        const handlerInfo = {
          handlerType: event[EVENT_TYPE_MEMBER_NAME],
          parameters: event.parameters,
        }

        const resolvedParams = {}
        for (let paramName in handlerInfo.parameters) {
          const paramValue = handlerInfo.parameters[paramName]
          resolvedParams[paramName] = () => mustache.render(paramValue, {
            state: getCurrentState(),
            context,
          })
          // const paramBinding = parseBinding(paramValue)
          // if (!paramBinding) {
          //   resolvedParams[paramName] = () => paramValue
          //   continue
          // }

          // let paramValueSource

          // if (paramBinding.source === "context") paramValueSource = context
          // if (paramBinding.source === "state")
          //   paramValueSource = getCurrentState()

          // // The new dynamic event parameter bound to the relevant source
          // resolvedParams[paramName] = () =>
          //   getState(paramValueSource, paramBinding.path, paramBinding.fallback)
        }

        handlerInfo.parameters = resolvedParams
        handlersInfos.push(handlerInfo)
      }

      if (handlersInfos.length === 0) {
        initialProps[propName] = doNothing
      } else {
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
  return async context => {
    const parameters = {}
    for (let paramName in handlerInfo.parameters) {
      parameters[paramName] = handlerInfo.parameters[paramName](context)
    }
    await handlerType.execute(parameters)
  }
}
