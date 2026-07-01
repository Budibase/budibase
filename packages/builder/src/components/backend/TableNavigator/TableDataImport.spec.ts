import { render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockLayout from "@/test/mocks/MockLayout.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"
import { API } from "@/api"

vi.mock("@budibase/bbui", () => ({
  Icon: MockIcon,
  Label: MockBody,
  Layout: MockLayout,
  Select: MockSelect,
}))

vi.mock("@budibase/frontend-core", () => ({
  Constants: {
    TypeIconMap: new Proxy(
      {},
      {
        get: () => "",
      }
    ),
  },
  canBeDisplayColumn: vi.fn(() => true),
}))

vi.mock("@/api", () => ({
  API: {
    validateNewTableImport: vi.fn(),
  },
}))

import TableDataImport from "./TableDataImport.svelte"

describe("TableDataImport", () => {
  it("does not validate or re-enter updates when mounted without imported rows", () => {
    render(TableDataImport, {
      props: {
        rows: [],
        schema: {},
        allValid: true,
        displayColumn: null,
      },
    })

    expect(screen.getByText("Upload")).toBeInTheDocument()
    expect(API.validateNewTableImport).not.toHaveBeenCalled()
  })
})
