import { it, expect, describe, vi } from "vitest"
import AISettings from "./index.svelte"
import { render } from "@testing-library/svelte"
import { admin, licensing } from "stores/portal"
import { notifications } from "@budibase/bbui"

vi.spyOn(notifications, "error").mockImplementation(vi.fn)
vi.spyOn(notifications, "success").mockImplementation(vi.fn)

const Hosting = {
  Cloud: "cloud",
  Self: "self",
}

function setupEnv(hosting, features = {}) {
  const defaultFeatures = {
    budibaseAIEnabled: false,
    customAIConfigsEnabled: false,
    ...features,
  }
  admin.subscribe = vi.fn().mockImplementation(callback => {
    callback({ cloud: hosting === Hosting.Cloud })
    return () => {}
  })
  licensing.subscribe = vi.fn().mockImplementation(callback => {
    callback(defaultFeatures)
    return () => {}
  })
}

describe("AISettings", () => {
  let instance = null

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("that the AISettings is rendered", () => {
    instance = render(AISettings, {})
    expect(instance).toBeDefined()
  })

  describe("Licensing", () => {
    it("should show the premium label on self host for custom configs", async () => {
      setupEnv(Hosting.Self)
      instance = render(AISettings, {})
      const premiumTag = instance.queryByText("Premium")
      expect(premiumTag).toBeInTheDocument()
    })

    it("should show the enterprise label on cloud for custom configs", async () => {
      setupEnv(Hosting.Cloud)
      instance = render(AISettings, {})
      const enterpriseTag = instance.queryByText("Enterprise")
      expect(enterpriseTag).toBeInTheDocument()
    })

    it("should show the premium label on cloud when Budibase AI isn't enabled", async () => {
      setupEnv(Hosting.Cloud)
      instance = render(AISettings, {})
      const premiumTag = instance.queryByText("Premium")
      expect(premiumTag).toBeInTheDocument()
    })

    it("should not show the add configuration button if the user doesn't have the correct license on cloud", async () => {
      let addConfigurationButton

      setupEnv(Hosting.Cloud)
      instance = render(AISettings)
      addConfigurationButton = instance.queryByText("Add configuration")
      expect(addConfigurationButton).not.toBeInTheDocument()

      setupEnv(Hosting.Cloud, { customAIConfigsEnabled: true })
      instance = render(AISettings)
      addConfigurationButton = instance.queryByText("Add configuration")
      expect(addConfigurationButton).toBeInTheDocument()
    })

    it("should not show the add configuration button if the user doesn't have the correct license on self host", async () => {
      let addConfigurationButton

      setupEnv(Hosting.Self)
      instance = render(AISettings)
      addConfigurationButton = instance.queryByText("Add configuration")
      expect(addConfigurationButton).not.toBeInTheDocument()

      setupEnv(Hosting.Self, { customAIConfigsEnabled: true })
      instance = render(AISettings, {})
      addConfigurationButton = instance.queryByText("Add configuration")
      expect(addConfigurationButton).toBeInTheDocument()
    })
  })
})
