export interface ScreenRequest {
  showNavigation: boolean
  width: string
  name: string
  template: string
  props: ScreenProps
  routing: ScreenRouting
}

interface ScreenProps {
  _id: string
  _component: string
  _styles: {
    normal: {}
    hover: {}
    active: {}
    selected: {}
  }
  _children: []
  _instanceName: string
  direction: string
  hAlign: string
  vAlign: string
  size: string
  gap: string
}

interface ScreenRouting {
  route: string
  roleId: string
  homeScreen: boolean
}
