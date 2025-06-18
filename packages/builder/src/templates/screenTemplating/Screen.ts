import { BaseStructure } from "../BaseStructure"
import { Helpers } from "@budibase/bbui"
import { ScreenVariant, Screen as ScreenDoc } from "@budibase/types"

export class Screen extends BaseStructure<ScreenDoc> {
  constructor(workspaceAppId: string | undefined) {
    super(true, {
      showNavigation: true,
      width: "Large",
      props: {
        _id: Helpers.uuid(),
        _component: "@budibase/standard-components/container",
        _styles: {
          normal: {},
          hover: {},
          active: {},
          selected: {},
        },
        _children: [],
        _instanceName: "",
        layout: "flex",
        direction: "column",
        hAlign: "stretch",
        vAlign: "top",
        size: "grow",
        gap: "M",
      },
      routing: {
        route: "",
        roleId: "BASIC",
        homeScreen: false,
      },
      name: "screen-id",
      workspaceAppId,
    })
  }

  role(role: string) {
    this._json.routing.roleId = role
    return this
  }

  normalStyle(styling: any) {
    this._json.props._styles.normal = styling
    return this
  }

  component(name: string) {
    this._json.props._component = name
    return this
  }

  table(tableName: string) {
    this._json.props.table = tableName
    return this
  }

  route(route: string) {
    this._json.routing.route = route
    return this
  }

  name(name: string) {
    this._json.name = name
    return this
  }

  autoTableId(autoTableId: string) {
    ;(this._json as any).autoTableId = autoTableId
    return this
  }

  instanceName(name: string) {
    this._json.props._instanceName = name
    return this
  }

  customProps(props: Record<string, string>) {
    for (let key of Object.keys(props)) {
      this._json.props[key] = props[key]
    }
    return this
  }
}

export class PDFScreen extends Screen {
  constructor(workspaceAppId: string | undefined) {
    super(workspaceAppId)
    this._json.variant = ScreenVariant.PDF
    this._json.width = "Max"
    this._json.showNavigation = false
    this._json.props = {
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/pdf",
      _styles: {
        normal: {},
        hover: {},
        active: {},
        selected: {},
      },
      _children: [],
      _instanceName: "PDF",
      title: "PDF",
    }
  }
}
