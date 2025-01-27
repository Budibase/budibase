interface BaseUIComponentError {
  key: string
  message: string
}

interface UISettingComponentError extends BaseUIComponentError {
  errorType: "setting"
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
