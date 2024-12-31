import { it, expect, describe, vi } from "vitest"
import AISettings from "./index.svelte"
import { render, fireEvent } from "@testing-library/svelte"
import { admin, licensing, featureFlags } from "@/stores/portal"
import { notifications } from "@budibase/bbui"

vi.spyOn(notifications, "error").mockImplementation(vi.fn)
vi.spyOn(notifications, "success").mockImplementation(vi.fn)

const Hosting = {
  Cloud: "cloud",
  Self: "self",
}

function setupEnv(hosting, features = {}, flags = {}) {
  const defaultFeatures = {
    budibaseAIEnabled: false,
    customAIConfigsEnabled: false,
    ...features,
  }
  const defaultFlags = {
    BUDIBASE_AI: false,
    AI_CUSTOM_CONFIGS: false,
    ...flags,
  }
  admin.subscribe = vi.fn().mockImplementation(callback => {
    callback({ cloud: hosting === Hosting.Cloud })
    return () => {}
  })
  licensing.subscribe = vi.fn().mockImplementation(callback => {
    callback(defaultFeatures)
    return () => {}
  })
  featureFlags.subscribe = vi.fn().mockImplementation(callback => {
    callback(defaultFlags)
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

    it("the add configuration button should not do anything the user doesn't have the correct license on cloud", async () => {
      let addConfigurationButton
      let configModal

      setupEnv(Hosting.Cloud)
      instance = render(AISettings)
      addConfigurationButton = instance.queryByText("Add configuration")
      expect(addConfigurationButton).toBeInTheDocument()
      await fireEvent.click(addConfigurationButton)
      configModal = instance.queryByText("Custom AI Configuration")
      expect(configModal).not.toBeInTheDocument()
    })

    it("the add configuration button should open the config modal if the user has the correct license on cloud", async () => {
      let addConfigurationButton
      let configModal

      setupEnv(
        Hosting.Cloud,
        { customAIConfigsEnabled: true },
        { AI_CUSTOM_CONFIGS: true }
      )
      instance = render(AISettings)
      addConfigurationButton = instance.queryByText("Add configuration")
      expect(addConfigurationButton).toBeInTheDocument()
      await fireEvent.click(addConfigurationButton)
      configModal = instance.queryByText("Custom AI Configuration")
      expect(configModal).toBeInTheDocument()
    })

    it("the add configuration button should open the config modal if the user has the correct license on self host", async () => {
      let addConfigurationButton
      let configModal

      setupEnv(
        Hosting.Self,
        { customAIConfigsEnabled: true },
        { AI_CUSTOM_CONFIGS: true }
      )
      instance = render(AISettings)
      addConfigurationButton = instance.queryByText("Add configuration")
      expect(addConfigurationButton).toBeInTheDocument()
      await fireEvent.click(addConfigurationButton)
      configModal = instance.queryByText("Custom AI Configuration")
      expect(configModal).toBeInTheDocument()
    })
  })
})
