import {
  isEventType,
  eventHandlers,
  EVENT_TYPE_MEMBER_NAME,
} from "./eventHandlers"
import { bbFactory } from "./bbComponentApi"
import mustache from "mustache"
import { get } from "svelte/store"
import { appStore } from "./store"

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
  let currentState

  const getCurrentState = () => currentState

  const bb = bbFactory({
    store: appStore,
    getCurrentState,
    componentLibraries,
    onScreenSlotRendered,
  })

  const setup = _setup({ handlerTypes, getCurrentState, bb, store: appStore })

  return {
    setup,
    destroy: () => {},
    getCurrentState,
    store: appStore,
  }
}

const _setup = ({ handlerTypes, getCurrentState, bb, store }) => node => {
  const props = node.props
  const context = node.context || {}
  const initialProps = { ...props }
  const currentStoreState = get(appStore)

  for (let propName in props) {
    if (isMetaProp(propName)) continue

    const propValue = props[propName]

    // A little bit of a hack - won't bind if the string doesn't start with {{
    const isBound = typeof propValue === "string" && propValue.startsWith("{{")

    if (isBound) {
      initialProps[propName] = mustache.render(propValue, {
        state: currentStoreState,
        context,
      })

      if (!node.stateBound) {
        node.stateBound = true
      }
    }

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
          resolvedParams[paramName] = () =>
            mustache.render(paramValue, {
              state: getCurrentState(),
              context,
            })
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

  const setup = _setup({ handlerTypes, getCurrentState, bb, store })
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
