import { it, expect, describe, vi, beforeEach, afterEach } from "vitest"
import { render, waitFor } from "@testing-library/svelte"
import RequestPanel from "./RequestPanel.svelte"
import { SecretTag, type RestRequestPreview } from "@budibase/types"

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  return {
    tables: writable({ list: [] }),
    datasources: writable({ list: [] }),
    flags: writable({}),
    appStore: writable({ appId: "app_test" }),
  }
})

const REQUEST: RestRequestPreview = {
  url: "https://example.com/things?foo=bar",
  path: "/things",
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${SecretTag.BEARER}`,
  },
  params: { foo: "bar" },
}

beforeEach(() => {
  const modalContainer = document.createElement("div")
  modalContainer.classList.add("modal-container")
  document.body.appendChild(modalContainer)
})

afterEach(() => {
  document.querySelectorAll(".modal-container").forEach(el => el.remove())
})

describe("RequestPanel", () => {
  it("renders a placeholder when there is no request", () => {
    const { container } = render(RequestPanel, { request: undefined })
    expect(container.querySelector(".placeholder")).toBeTruthy()
  })

  it("renders the request as JSON", async () => {
    const { container } = render(RequestPanel, { request: REQUEST })
    await waitFor(() => {
      expect(container.querySelector(".cm-editor")).toBeTruthy()
    })
    expect(container.textContent).toContain(
      "https://example.com/things?foo=bar"
    )
  })

  it("renders redacted credentials as a badge rather than text", async () => {
    const { container } = render(RequestPanel, { request: REQUEST })
    await waitFor(() => {
      expect(container.querySelector(".hbs-tag")).toBeTruthy()
    })
    const tag = container.querySelector(".hbs-tag__text")
    expect(tag?.textContent).toEqual("Auth token")
    // the raw handlebars form should have been replaced by the widget
    expect(container.textContent).not.toContain("{{ Auth token }}")
  })
})
