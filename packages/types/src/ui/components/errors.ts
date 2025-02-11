interface BaseUIComponentError {
  componentId: string
  message: string
}

interface UISettingComponentError extends BaseUIComponentError {
  errorType: "setting"
  key: string
  label: string
  cause: "missing" | "invalid"
}

interface UIAncestorComponentError extends BaseUIComponentError {
  errorType: "ancestor-setting"
  ancestor: {
    name: string
    fullType: string
  }
}

export type UIComponentError =
  | UISettingComponentError
  | UIAncestorComponentError
