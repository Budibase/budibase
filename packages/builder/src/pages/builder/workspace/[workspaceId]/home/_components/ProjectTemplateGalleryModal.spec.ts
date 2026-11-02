import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"

vi.mock("@budibase/bbui", () => ({
  Button: MockButton,
  Icon: MockIcon,
  ModalContent: MockModalContent,
  ProgressCircle: MockBody,
}))

import ProjectTemplateGalleryModal from "./ProjectTemplateGalleryModal.svelte"

const template = ({
  key,
  name,
  status = "active",
}: {
  key: string
  name: string
  status?: "active" | "deprecated" | "withdrawn"
}) => ({
  key,
  version: "1.0.0",
  packageVersion: 1,
  catalogueVersion: "2026-07-28.1",
  name,
  description: `${name} template`,
  category: "Operations",
  status,
  owner: "solutions-engineering",
  compatibility: {
    minBudibaseVersion: "0.0.0",
    maxBudibaseVersionExclusive: "9999.0.0",
    requiredFeatures: ["projects"],
  },
})

describe("ProjectTemplateGalleryModal", () => {
  it("shows only active curated templates and selects one", async () => {
    const active = template({
      key: "project/operations",
      name: "Operations",
    })
    const deprecated = template({
      key: "project/legacy",
      name: "Legacy",
      status: "deprecated",
    })
    const onSelect = vi.fn()

    render(ProjectTemplateGalleryModal, {
      props: {
        templates: [deprecated, active],
        onSelect,
      },
    })

    expect(
      screen.queryByRole("button", { name: "Use Legacy" })
    ).not.toBeInTheDocument()
    await fireEvent.click(
      screen.getByRole("button", { name: "Use Operations" })
    )
    expect(onSelect).toHaveBeenCalledWith(active)
  })

  it("shows a compatibility-aware empty state", () => {
    render(ProjectTemplateGalleryModal, {
      props: {
        templates: [],
      },
    })

    expect(
      screen.getByText(/No curated Project templates are available/)
    ).toBeInTheDocument()
  })

  it("shows loading and retry states", async () => {
    const onRetry = vi.fn()
    const { rerender } = render(ProjectTemplateGalleryModal, {
      props: { isLoading: true, onRetry },
    })

    expect(screen.getByText("Loading templates…")).toBeInTheDocument()

    await rerender({
      isLoading: false,
      error: "Catalogue unavailable",
      onRetry,
    })
    await fireEvent.click(screen.getByText("Try again"))
    expect(screen.getByRole("alert")).toHaveTextContent("Catalogue unavailable")
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it("disables every template while the selected template imports", () => {
    render(ProjectTemplateGalleryModal, {
      props: {
        templates: [
          template({ key: "project/support", name: "Support" }),
          template({ key: "project/crm", name: "CRM" }),
        ],
        selectedTemplateKey: "project/support",
        isImporting: true,
      },
    })

    const support = screen.getByRole("button", { name: "Use Support" })
    expect(support).toBeDisabled()
    expect(support).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("button", { name: "Use CRM" })).toBeDisabled()
    expect(screen.getByText("Importing…")).toBeInTheDocument()
  })
})
