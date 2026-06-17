import { it, expect, describe, vi, beforeEach, afterEach } from "vitest"
import { render, waitFor, fireEvent } from "@testing-library/svelte"
import ResponsePanel from "./ResponsePanel.svelte"
import type { PreviewQueryResponse } from "@budibase/types"

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  return {
    tables: writable({ list: [] }),
    datasources: writable({ list: [] }),
    flags: writable({}),
    appStore: writable({ appId: "app_test" }),
  }
})

const RESPONSE_200: PreviewQueryResponse = {
  rows: [{ id: 1 }],
  schema: {},
  nestedSchemaFields: {},
  info: { code: 200, time: "50ms", size: "1kb" },
  extra: { headers: { "content-type": "application/json" }, raw: '{"id":1}' },
}

const RESPONSE_500: PreviewQueryResponse = {
  rows: [],
  schema: {},
  nestedSchemaFields: {},
  info: { code: 500, time: "10ms", size: "0kb" },
  extra: { headers: {}, raw: "Internal Server Error" },
}

const defaultProps = () => ({
  datasource: undefined,
  dynamicVariables: {},
})

beforeEach(() => {
  const modalContainer = document.createElement("div")
  modalContainer.classList.add("modal-container")
  document.body.appendChild(modalContainer)
})

afterEach(() => {
  document.querySelectorAll(".modal-container").forEach(el => el.remove())
})

describe("ResponsePanel", () => {
  describe("no response", () => {
    it("renders a placeholder when there is no response or schema", () => {
      const { container } = render(ResponsePanel, defaultProps())
      expect(container.querySelector(".placeholder")).not.toBeNull()
    })
  })

  describe("with a response", () => {
    it("shows status, time and size stats", async () => {
      const { container } = render(ResponsePanel, {
        ...defaultProps(),
        response: RESPONSE_200,
      })
      await waitFor(() => {
        const stats = container.querySelector(".stats")
        expect(stats?.textContent).toContain("200")
        expect(stats?.textContent).toContain("50ms")
        expect(stats?.textContent).toContain("1kb")
      })
    })

    it("renders JSON, Raw, Headers and Schema tabs", async () => {
      const { container } = render(ResponsePanel, {
        ...defaultProps(),
        response: RESPONSE_200,
      })
      await waitFor(() => {
        const tabs = Array.from(
          container.querySelectorAll(".spectrum-Tabs-item")
        ).map(t => t.textContent?.trim())
        expect(tabs).toEqual(
          expect.arrayContaining(["JSON", "Raw", "Headers", "Schema"])
        )
      })
    })

    it("clicking the Raw tab shows the raw response text", async () => {
      const { container } = render(ResponsePanel, {
        ...defaultProps(),
        response: RESPONSE_200,
      })
      const rawTab = await waitFor(() => {
        const tab = Array.from(
          container.querySelectorAll(".spectrum-Tabs-item")
        ).find(t => t.textContent?.trim() === "Raw") as HTMLElement | undefined
        expect(tab).not.toBeUndefined()
        return tab!
      })
      await fireEvent.click(rawTab)
      await waitFor(() => {
        const textarea = container.querySelector(
          ".raw textarea"
        ) as HTMLTextAreaElement | null
        expect(textarea).not.toBeNull()
        expect(textarea?.value).toBe('{"id":1}')
      })
    })

    it("status code is styled red for a 500 response", async () => {
      const { container } = render(ResponsePanel, {
        ...defaultProps(),
        response: RESPONSE_500,
      })
      await waitFor(() => {
        const codeSpan = container.querySelector(".stats .red")
        expect(codeSpan?.textContent).toContain("500")
      })
    })

    it("status code is styled green for a 200 response", async () => {
      const { container } = render(ResponsePanel, {
        ...defaultProps(),
        response: RESPONSE_200,
      })
      await waitFor(() => {
        const codeSpan = container.querySelector(".stats .green")
        expect(codeSpan?.textContent).toContain("200")
      })
    })
  })
})
