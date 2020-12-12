import { BaseStructure } from "./BaseStructure"

export class Screen extends BaseStructure {
  constructor() {
    super(true)
    this._json = {
      layoutId: "layout_private_master",
      props: {
        _id: "",
        _component: "",
        _styles: {
          normal: {},
          hover: {},
          active: {},
          selected: {},
        },
        _children: [],
        _instanceName: "",
      },
      routing: {
        route: "",
        roleId: "BASIC",
      },
      name: "screen-id",
    }
  }

  normalStyle(styling) {
    this._json.props._styles.normal = styling
    return this
  }

  component(name) {
    this._json.props._component = name
    return this
  }

  table(tableName) {
    this._json.props.table = tableName
    return this
  }

  mainType(type) {
    this._json.type = type
    return this
  }

  route(route) {
    this._json.routing.route = route
    return this
  }

  name(name) {
    this._json.name = name
    return this
  }

  instanceName(name) {
    this._json.props._instanceName = name
    return this
  }
}
