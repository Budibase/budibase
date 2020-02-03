import { getComponentInfo, createProps, getInstanceProps } from "./createProps"

export const buildPropsHierarchy = (components, screens, baseComponent) => {
  const allComponents = [...components, ...screens]

  const buildProps = (componentDefinition, derivedFromProps) => {
    const { props } = createProps(componentDefinition, derivedFromProps)
    const propsDefinition = componentDefinition.props
    props._component = componentDefinition.name
    for (let propName in props) {
      if (propName === "_component") continue

      const propDef = propsDefinition[propName]
      if (!propDef) continue
      if (propName === "_children") {
        const childrenProps = props[propName]

        if (!childrenProps || childrenProps.length === 0) {
          continue
        }

        props[propName] = []

        for (let child of childrenProps) {
          const propComponentInfo = getComponentInfo(
            allComponents,
            child._component
          )

          const subComponentInstanceProps = getInstanceProps(
            propComponentInfo,
            child
          )

          props[propName].push(
            buildProps(
              propComponentInfo.rootComponent.name,
              propComponentInfo.propsDefinition,
              subComponentInstanceProps
            )
          )
        }
      }
    }

    return props
  }

  if (!baseComponent) return {}

  const baseComponentInfo = getComponentInfo(allComponents, baseComponent)

  return buildProps(
    baseComponentInfo.rootComponent,
    baseComponentInfo.fullProps
  )
}
