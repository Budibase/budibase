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

  const setupDOM = () => {
    instance = render(AISettings, {})
    const modalContainer = document.createElement("div")
    modalContainer.classList.add("modal-container")
    instance.baseElement.appendChild(modalContainer)
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("that the AISettings is rendered", () => {
    setupDOM()
    expect(instance).toBeDefined()
  })

  describe("DOM Render tests", () => {
    it("the enable bb ai button should not do anything if the user doesn't have the correct license on self host", async () => {
      let addAiButton
      let configModal

      setupEnv(Hosting.Self, { customAIConfigsEnabled: false })
      setupDOM()
      addAiButton = instance.queryByText("Enable BB AI")
      expect(addAiButton).toBeInTheDocument()
      await fireEvent.click(addAiButton)
      configModal = instance.queryByText("Custom AI Configuration")
      expect(configModal).not.toBeInTheDocument()
    })
  })
})
