import { eventHandlers } from "./eventHandlers"
import { bbFactory } from "./bbComponentApi"
import renderTemplateString from "./renderTemplateString"
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
  let runEventActions = eventHandlers(routeTo)

  const bb = bbFactory({
    componentLibraries,
    onScreenSlotRendered,
    runEventActions,
  })

  const setup = _setup(bb)

  return {
    setup,
    destroy: () => {},
  }
}

const _setup = bb => node => {
  const props = node.props
  const initialProps = { ...props }

  for (let propName in props) {
    if (isMetaProp(propName)) continue

    const propValue = props[propName]

    const isBound = hasBinding(propValue)

    if (isBound) {
      const state = appStore.getState(node.contextStoreKey)
      initialProps[propName] = renderTemplateString(propValue, state)

      if (!node.stateBound) {
        node.stateBound = true
      }
    }
  }

  const setup = _setup(bb)
  initialProps._bb = bb(node, setup)

  return initialProps
}
