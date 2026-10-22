import { fireEvent, render, screen } from "@testing-library/svelte"
import type { ProjectResponse } from "@budibase/types"
import { describe, expect, it, vi } from "vitest"
import MockActionMenu from "@/test/mocks/MockActionMenu.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockMenuItem from "@/test/mocks/MockMenuItem.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"

vi.mock("@budibase/bbui", () => ({
  ActionMenu: MockActionMenu,
  Icon: MockIcon,
  MenuItem: MockMenuItem,
  MenuSeparator: MockSlot,
}))

import HomeProjectTabs from "./HomeProjectTabs.svelte"

const projects: ProjectResponse[] = [
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

  it("disables export for an empty selected project", () => {
    render(HomeProjectTabs, {
      props: {
        projects,
        selectedProjectId: "project_operations",
        exportProjectDisabled: true,
      },
    })

    expect(
      screen.getByRole("button", { name: "Export project" })
    ).toBeDisabled()
  })

  it.each(["", "project_operations"])(
    "keeps incomplete project tabs quiet when selection is %s",
    selectedProjectId => {
      render(HomeProjectTabs, {
        projects: [
          {
            ...projects[0],
            importSetup: {
              resources: {},
              requirements: [
                {
                  type: "datasource_secrets",
                  resourceId: "datasource_1",
                  name: "Customer database",
                  reason: "Add connection credentials.",
                },
              ],
              unsupportedContent: [],
            },
          },
          projects[1],
        ],
        selectedProjectId,
      })

      expect(screen.queryByRole("img", { name: "Setup incomplete" })).toBeNull()
      expect(screen.getByRole("button", { name: "Operations" })).toBeTruthy()
      expect(screen.getByRole("button", { name: "Reporting" })).toBeTruthy()
    }
  )

  it("opens project setup with a remaining count grouped by resource", async () => {
    const onSetupProject = vi.fn()
    render(HomeProjectTabs, {
      projects: [
        {
          ...projects[0],
          importSetup: {
            resources: {},
            requirements: [
              {
                type: "agent_ai_config",
                resourceId: "agent_1",
                name: "Support agent",
                reason: "Choose an AI model.",
              },
              {
                type: "agent_secrets",
                resourceId: "agent_1",
                name: "Support agent",
                reason: "Reconnect integrations.",
              },
              {
                type: "datasource_secrets",
                resourceId: "datasource_1",
                name: "Customer database",
                reason: "Add connection credentials.",
              },
            ],
            unsupportedContent: [],
          },
        },
      ],
      selectedProjectId: "project_operations",
      onSetupProject,
    })

    const setupAction = screen.getByRole("button", {
      name: "Project setup 2 remaining",
    })
    expect(setupAction).toHaveAttribute("data-icon", "list-checks")
    expect(screen.queryByText("Finish setup")).toBeNull()
    expect(
      screen.queryByText(/Hide setup reminder|Show setup reminder/)
    ).toBeNull()
    await fireEvent.click(setupAction)

    expect(onSetupProject).toHaveBeenCalledOnce()
  })

  it("keeps project setup available without a count once setup is complete", async () => {
    const onSetupProject = vi.fn()
    render(HomeProjectTabs, {
      projects: [
        {
          ...projects[0],
          importSetup: {
            resources: {},
            requirements: [],
            unsupportedContent: [],
          },
        },
      ],
      selectedProjectId: "project_operations",
      onSetupProject,
    })

    expect(screen.queryByRole("img", { name: "Setup incomplete" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Finish setup" })).toBeNull()
    expect(screen.queryByText(/remaining/)).toBeNull()
    await fireEvent.click(screen.getByRole("button", { name: "Project setup" }))

    expect(onSetupProject).toHaveBeenCalledOnce()
  })

  it("does not offer import setup for projects without an import", () => {
    render(HomeProjectTabs, {
      projects,
      selectedProjectId: "project_operations",
    })

    expect(screen.queryByRole("img", { name: "Setup incomplete" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Finish setup" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Project setup" })).toBeNull()
  })
})
