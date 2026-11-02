import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"
import MockAsyncModalContent from "@/test/mocks/MockAsyncModalContent.svelte"

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Input: MockInput,
  Layout: MockBody,
  ModalContent: MockAsyncModalContent,
  Select: MockSelect,
}))

import ImportProjectTemplateModal from "./ImportProjectTemplateModal.svelte"

const template = {
  key: "project/expense-approval",
  version: "1.0.0",
  packageVersion: 1,
  catalogueVersion: "2026-07-28.1",
  name: "Expense approval",
  description: "Route and track employee expense requests.",
  category: "Approvals",
  status: "active" as const,
  owner: "solutions-engineering",
  compatibility: {
    minBudibaseVersion: "0.0.0",
    maxBudibaseVersionExclusive: "9999.0.0",
    requiredFeatures: ["projects"],
  },
}

const workspaces = [
  { id: "app_dev_current", name: "Operations" },
  { id: "app_dev_other", name: "Finance" },
]

describe("ImportProjectTemplateModal", () => {
  it("defaults to and explicitly names the current workspace", async () => {
    const onConfirm = vi.fn()
    render(ImportProjectTemplateModal, {
      props: {
        template,
        workspaces,
        currentWorkspaceId: "app_dev_current",
        onConfirm,
      },
    })

    expect(screen.getByLabelText("Destination workspace")).toHaveValue(
      "app_dev_current"
    )
    expect(
      screen.getByRole("option", {
        name: "Operations (current workspace)",
      })
    ).toBeInTheDocument()

    await fireEvent.click(screen.getByText("Import project"))

    expect(onConfirm).toHaveBeenCalledWith({
      templateKey: template.key,
      workspaceId: "app_dev_current",
    })
  })

  it("imports into a different selected workspace", async () => {
    const onConfirm = vi.fn()
    render(ImportProjectTemplateModal, {
      props: {
        template,
        workspaces,
        currentWorkspaceId: "app_dev_current",
        onConfirm,
      },
    })

    await fireEvent.change(screen.getByLabelText("Destination workspace"), {
      target: { value: "app_dev_other" },
    })
    await fireEvent.click(screen.getByText("Import project"))

    expect(onConfirm).toHaveBeenCalledWith({
      templateKey: template.key,
      workspaceId: "app_dev_other",
    })
  })

  it("offers workspace creation first while keeping the current workspace selected", async () => {
    const onConfirm = vi.fn()
    render(ImportProjectTemplateModal, {
      props: {
        template,
        workspaces,
        currentWorkspaceId: "app_dev_current",
        canCreateWorkspace: true,
        onConfirm,
      },
    })

    expect(screen.getByLabelText("Destination workspace")).toHaveValue(
      "app_dev_current"
    )
    expect(
      screen.getAllByRole("option").map(option => option.textContent)
    ).toEqual([
      "Create a new workspace",
      "Operations (current workspace)",
      "Finance",
    ])

    await fireEvent.change(screen.getByLabelText("Destination workspace"), {
      target: { value: "__create_workspace__" },
    })
    await fireEvent.input(screen.getByLabelText("Workspace name"), {
      target: { value: "Customer success" },
    })
    await fireEvent.click(screen.getByText("Import project"))

    expect(onConfirm).toHaveBeenCalledWith({
      templateKey: template.key,
      workspaceName: "Customer success",
    })
  })

  it("defaults to workspace creation when licensed and none is editable", () => {
    render(ImportProjectTemplateModal, {
      props: {
        template,
        workspaces: [],
        canCreateWorkspace: true,
      },
    })

    expect(screen.getByLabelText("Destination workspace")).toHaveValue(
      "__create_workspace__"
    )
    expect(screen.getByLabelText("Workspace name")).toHaveValue(
      "Expense approval workspace"
    )
    expect(screen.getByText("Import project")).toBeEnabled()
  })

  it("locks a created workspace as the retry destination", async () => {
    const onConfirm = vi.fn()
    render(ImportProjectTemplateModal, {
      props: {
        template,
        workspaces,
        currentWorkspaceId: "app_dev_current",
        canCreateWorkspace: true,
        createdWorkspace: {
          id: "app_dev_created",
          name: "Customer success",
        },
        onConfirm,
      },
    })

    expect(
      screen.queryByLabelText("Destination workspace")
    ).not.toBeInTheDocument()
    expect(
      screen.getByText("Customer success").parentElement
    ).toHaveTextContent("Workspace Customer success was created")

    await fireEvent.click(screen.getByText("Import project"))

    expect(onConfirm).toHaveBeenCalledWith({
      templateKey: template.key,
      workspaceId: "app_dev_created",
    })
  })

  it("keeps the import action loading until confirmation settles", async () => {
    let resolveImport!: () => void
    const onConfirm = vi.fn(
      () =>
        new Promise<void>(resolve => {
          resolveImport = resolve
        })
    )
    render(ImportProjectTemplateModal, {
      props: {
        template,
        workspaces,
        currentWorkspaceId: "app_dev_current",
        onConfirm,
      },
    })

    await fireEvent.click(screen.getByText("Import project"))
    expect(screen.getByText("Importing")).toBeDisabled()

    resolveImport()
    await waitFor(() =>
      expect(screen.getByText("Import project")).toBeEnabled()
    )
  })

  it("disables import when no editable workspace is available", () => {
    render(ImportProjectTemplateModal, {
      props: {
        template,
        workspaces: [],
      },
    })

    expect(screen.getByText("Import project")).toBeDisabled()
    expect(
      screen.getByText(/No editable workspace is available/)
    ).toBeInTheDocument()
  })

  it("shows the reviewed deprecation guidance for a direct intent", () => {
    render(ImportProjectTemplateModal, {
      props: {
        template: {
          ...template,
          status: "deprecated",
          deprecation: {
            message: "This workflow has been replaced.",
            replacementKey: "project/expense-approval-v2",
          },
        },
        workspaces,
        currentWorkspaceId: "app_dev_current",
      },
    })

    expect(
      screen.getByText(/This workflow has been replaced/)
    ).toBeInTheDocument()
    expect(screen.getByText(/project\/expense-approval-v2/)).toBeInTheDocument()
  })
})
