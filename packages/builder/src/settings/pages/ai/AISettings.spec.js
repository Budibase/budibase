import { it, expect, describe, vi } from "vitest"
import { writable } from "svelte/store"
import AISettings from "./index.svelte"
import { render, waitFor } from "@testing-library/svelte"
import { admin, licensing, featureFlags } from "@/stores/portal"
import { notifications } from "@budibase/bbui"
import { API } from "@/api"
import { Hosting } from "@budibase/types"

const defaultFeatures = {
  budibaseAIEnabled: false,
}
const defaultFlags = {
  BUDIBASE_AI: false,
  AI_CUSTOM_CONFIGS: false,
}

vi.spyOn(notifications, "error").mockImplementation(vi.fn)
vi.spyOn(notifications, "success").mockImplementation(vi.fn)
vi.mock("@/api", () => ({
  API: {
    getConfig: vi.fn().mockResolvedValue({
      config: {},
    }),
    getLicenseKey: vi.fn().mockResolvedValue({
      licenseKey: "abc-123",
    }),
    saveConfig: vi.fn(),
  },
}))

vi.mock("@/stores/portal", () => {
  const toMock = (store, extra) => {
    return {
      subscribe: store.subscribe,
      update: store.update,
      set: store.set,
      ...extra,
    }
  }

  const mockaiConfigsStore = writable({
    customConfigs: [],
  })
  return {
    admin: toMock(writable()),
    licensing: toMock(writable()),
    featureFlags: toMock(writable()),
    aiConfigsStore: toMock(mockaiConfigsStore, {
      fetch: vi.fn(),
    }),
  }
})

vi.mock("@/stores/builder", () => {
  const mockAppStore = writable()
  const appStore = {
    subscribe: mockAppStore.subscribe,
    update: mockAppStore.update,
    set: mockAppStore.set,
  }

  const mockWorkspaceAppStore = writable({
    selectedWorkspaceAppId: null,
    selectedWorkspaceApp: null,
    workspaceApps: [],
  })
  const workspaceAppStore = {
    subscribe: mockWorkspaceAppStore.subscribe,
    update: mockWorkspaceAppStore.update,
    set: mockWorkspaceAppStore.set,
  }

  return {
    appStore,
    workspaceAppStore,
  }
})

function setupEnv(hosting, features = {}, flags = {}) {
  admin.set({ cloud: hosting === Hosting.CLOUD })
  licensing.set({ ...defaultFeatures, ...features })
  featureFlags.set({ ...defaultFlags, ...flags })
}

describe("AISettings", () => {
  let instance = null

  const setupDOM = () => {
    instance = render(AISettings)
    const modalContainer = document.createElement("div")
    modalContainer.classList.add("modal-container")
    instance.baseElement.appendChild(modalContainer)
  }

  beforeEach(() => {
    setupEnv(Hosting.SELF)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("Basic rendering", () => {
    it("should show 'No LLMs are enabled' when no providers are active", async () => {
      API.getConfig.mockResolvedValueOnce({ config: {} })
      setupDOM()

      await waitFor(() => {
        const noEnabledText = instance.getByText("No LLMs are enabled")
        expect(noEnabledText).toBeInTheDocument()
      })
    })

    it("should display the 'Enable BB AI' button", async () => {
      API.getConfig.mockResolvedValueOnce({ config: {} })
      setupDOM()
      await waitFor(() => {
        const enableButton = instance.getByText("Enable BB AI")
        expect(enableButton).toBeInTheDocument()
      })
    })
  })

  describe("Provider rendering", () => {
    it("should display active provider with active status tag", async () => {
      API.getConfig.mockResolvedValueOnce({
        config: {
          BudibaseAI: {
            provider: "BudibaseAI",
            active: true,
            isDefault: true,
            name: "Budibase AI",
          },
        },
      })

      setupDOM()

      await waitFor(() => {
        const providerName = instance.getByText("Budibase AI")
        expect(providerName).toBeInTheDocument()

        const statusTags = instance.baseElement.querySelectorAll(".tag.active")
        expect(statusTags.length).toBeGreaterThan(0)

        let foundEnabledTag = false
        statusTags.forEach(tag => {
          if (tag.textContent === "Enabled") {
            foundEnabledTag = true
          }
        })
        expect(foundEnabledTag).toBe(true)
      })
    })

    it("should display disabled provider with disabled status tag", async () => {
      API.getConfig.mockResolvedValueOnce({
        config: {
          BudibaseAI: {
            provider: "BudibaseAI",
            active: true,
            isDefault: true,
            name: "Budibase AI",
          },
          OpenAI: {
            provider: "OpenAI",
            active: false,
            isDefault: false,
            name: "OpenAI",
          },
        },
      })

      setupDOM()

      await waitFor(async () => {
        const disabledProvider = instance.getByText("OpenAI")
        expect(disabledProvider).toBeInTheDocument()

        const disabledTags =
          instance.baseElement.querySelectorAll(".tag.disabled")
        expect(disabledTags.length).toBeGreaterThan(0)

        let foundDisabledTag = false
        disabledTags.forEach(tag => {
          if (tag.textContent === "Disabled") {
            foundDisabledTag = true
          }
        })
        expect(foundDisabledTag).toBe(true)

        const openAIOption = disabledProvider.closest(".option")
        expect(openAIOption).not.toBeNull()
        const disabledTagNearOpenAI =
          openAIOption.querySelector(".tag.disabled")
        expect(disabledTagNearOpenAI).not.toBeNull()
        expect(disabledTagNearOpenAI.textContent).toBe("Disabled")
      })
    })
  })
})
