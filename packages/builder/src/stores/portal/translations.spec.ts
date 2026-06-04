import { get } from "svelte/store"
import { describe, expect, it, vi } from "vitest"

vi.mock("./licensing", async () => {
  const { writable } = await import("svelte/store")
  return {
    licensing: writable({
      translationsEnabled: false,
    }),
  }
})

import { licensing } from "./licensing"
import { translations } from "./translations"

describe("translations store", () => {
  it("clears cached overrides when translations are disabled", () => {
    translations.set({
      loaded: true,
      config: {
        defaultLocale: "en",
        locales: {
          en: {
            label: "English",
            overrides: {
              "login.emailLabel": "Profile test",
            },
          },
        },
      },
    })

    licensing.set({
      translationsEnabled: true,
    })

    licensing.set({
      translationsEnabled: false,
    })

    expect(get(translations.store)).toEqual({
      loaded: false,
      config: {
        defaultLocale: "en",
        locales: {},
      },
    })
  })
})
