const actual = jest.requireActual("@budibase/pro")
const pro = {
  ...actual,
  features: {
    ...actual.features,
    isTriggerAutomationRunEnabled: () => {
      return true
    },
  },
}

export = pro
