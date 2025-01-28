interface BaseUIComponentError {
  message: string
}

interface UISettingComponentError extends BaseUIComponentError {
  errorType: "setting"
  key: string
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
