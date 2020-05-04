import {
  isString,
  isBoolean,
  isNumber,
  isArray,
  isPlainObject,
  every,
} from "lodash/fp"

import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers"

import {
  isBound,
  BB_STATE_BINDINGPATH,
} from "@budibase/client/src/state/parseBinding"

// const defaultDef = typeName => () => ({
//   type: typeName,
//   required: false,
//   default: types[typeName].default,
//   options: typeName === "options" ? [] : undefined,
// })

// const propType = (defaultValue, isOfType, defaultDefinition) => ({
//   isOfType,
//   default: defaultValue,
//   defaultDefinition,
// })

// const expandSingleProp = propDef => {
//   const p = isString(propDef) ? types[propDef].defaultDefinition() : propDef

//   if (!isString(propDef)) {
//     const def = types[propDef.type].defaultDefinition()
//     for (let p in def) {
//       if (propDef[p] === undefined) {
//         propDef[p] = def[p]
//       }
//     }
//   }

//   return p
// }

// export const expandComponentDefinition = componentDefinition => {
//   const expandedProps = {}
//   const expandedComponent = { ...componentDefinition }

//   for (let p in componentDefinition.props) {
//     expandedProps[p] = expandSingleProp(componentDefinition.props[p])
//   }

//   expandedComponent.props = expandedProps

//   if (expandedComponent.children !== false) {
//     expandedComponent.children = true
//   }

//   return expandedComponent
// }

// const isEvent = e =>
//   isPlainObject(e) &&
//   isString(e[EVENT_TYPE_MEMBER_NAME]) &&
//   isPlainObject(e.parameters)

// const isEventList = e => isArray(e) && every(isEvent)(e)

// const EMPTY_STATE = () => ({ [BB_STATE_BINDINGPATH]: "" });

// export const types = {
//   string: propType("", isString, defaultDef("string")),
//   bool: propType(false, isBoolean, defaultDef("bool")),
//   number: propType(0, isNumber, defaultDef("number")),
//   options: propType("", isString, defaultDef("options")),
//   asset: propType("", isString, defaultDef("asset")),
//   event: propType([], isEventList, defaultDef("event")),
//   // state: propType(EMPTY_STATE, isBound, defaultDef("state")),
// }


export const TYPE_MAP = {
  string: {
    default: ""
  },
  bool: {
    default: false
  },
  number: {
    default: 0
  },
  options: {
    default: [],
    options: []
  },
  event: {
    default: [],
  }
};
