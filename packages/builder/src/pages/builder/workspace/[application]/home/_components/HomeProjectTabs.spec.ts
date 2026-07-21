import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockActionMenu from "@/test/mocks/MockActionMenu.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockMenuItem from "@/test/mocks/MockMenuItem.svelte"

vi.mock("@budibase/bbui", () => ({
  ActionMenu: MockActionMenu,
  Icon: MockIcon,
  MenuItem: MockMenuItem,
}))

import HomeProjectTabs from "./HomeProjectTabs.svelte"

const projects = [
  {
    _id: "project_operations",
    _rev: "1-operations",
    name: "Operations",
    color: "#8CA171",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: "project_reporting",
    _rev: "1-reporting",
    name: "Reporting",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
]

describe("HomeProjectTabs", () => {
  it("selects projects and renders optional project colours", async () => {
    const onSelect = vi.fn()
    render(HomeProjectTabs, {
      props: {
        projects,
        onSelect,
      },
    })

    expect(
      screen.getByRole("button", { name: "All projects" })
    ).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "Operations" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
    expect(screen.getByTestId("project-color-project_operations")).toHaveStyle(
      "background-color: #8CA171"
    )
    expect(screen.queryByTestId("project-color-project_reporting")).toBeNull()

    await fireEvent.click(screen.getByRole("button", { name: "Reporting" }))
    expect(onSelect).toHaveBeenCalledWith("project_reporting")
  })

  it("keeps project and creation actions available", async () => {
    const onEditProject = vi.fn()
    const onDeleteProject = vi.fn()
    const onExportProject = vi.fn()
    const onCreateProject = vi.fn()
    const onImportProject = vi.fn()

    render(HomeProjectTabs, {
      props: {
        projects,
        selectedProjectId: "project_operations",
        onEditProject,
        onDeleteProject,
        onExportProject,
        onCreateProject,
        onImportProject,
      },
    })

    expect(screen.getByRole("button", { name: "Operations" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(
      screen.getByRole("button", { name: "Actions for Operations" })
    ).toBeTruthy()

    await fireEvent.click(screen.getByRole("button", { name: "Edit project" }))
    await fireEvent.click(
      screen.getByRole("button", { name: "Delete project" })
    )
    await fireEvent.click(
      screen.getByRole("button", { name: "Export project" })
    )
    await fireEvent.click(
      screen.getByRole("button", { name: "Create new project" })
    )
    await fireEvent.click(
      screen.getByRole("button", { name: "Import project" })
    )

    expect(onEditProject).toHaveBeenCalledOnce()
    expect(onDeleteProject).toHaveBeenCalledOnce()
    expect(onExportProject).toHaveBeenCalledOnce()
    expect(onCreateProject).toHaveBeenCalledOnce()
    expect(onImportProject).toHaveBeenCalledOnce()
  })
})
