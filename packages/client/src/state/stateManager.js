import {
  isEventType,
  eventHandlers,
  EVENT_TYPE_MEMBER_NAME,
} from "./eventHandlers"
import { bbFactory } from "./bbComponentApi"
import mustache from "mustache"
import appStore from "./store"
import hasBinding from "./hasBinding"

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
  componentLibraries,
  onScreenSlotRendered,
  routeTo,
}) => {
  let handlerTypes = eventHandlers(routeTo)

  // creating a reference to the current state
  // this avoids doing store.get() ... which is expensive on
  // hot paths, according to the svelte docs.
  // the state object reference never changes (although it's internals do)
  // so this should work fine for us
  let currentState
  appStore.subscribe(s => (currentState = s))
  const getCurrentState = () => currentState

  const bb = bbFactory({
    getCurrentState,
    componentLibraries,
    onScreenSlotRendered,
  })

  const setup = _setup({ handlerTypes, getCurrentState, bb })

  return {
    setup,
    destroy: () => {},
    getCurrentState,
  }
}

const _setup = ({ handlerTypes, getCurrentState, bb }) => node => {
  const props = node.props
  const initialProps = { ...props }

  for (let propName in props) {
    if (isMetaProp(propName)) continue

    const propValue = props[propName]

    const isBound = hasBinding(propValue)

    if (isBound) {
      const state = appStore.getState(node.contextStoreKey)
      initialProps[propName] = mustache.render(propValue, state)

      if (!node.stateBound) {
        node.stateBound = true
      }
    }

    if (isEventType(propValue)) {
      const state = appStore.getState(node.contextStoreKey)
      const handlersInfos = []
      for (let event of propValue) {
        const handlerInfo = {
          handlerType: event[EVENT_TYPE_MEMBER_NAME],
          parameters: event.parameters,
        }

        const resolvedParams = {}
        for (let paramName in handlerInfo.parameters) {
          const paramValue = handlerInfo.parameters[paramName]
          resolvedParams[paramName] = () => mustache.render(paramValue, state)
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

  const setup = _setup({ handlerTypes, getCurrentState, bb })
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
