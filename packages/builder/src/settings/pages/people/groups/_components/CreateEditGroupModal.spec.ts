import { render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockColorPicker from "@/test/mocks/MockColorPicker.svelte"
import MockIconPicker from "@/test/mocks/MockIconPicker.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"
import MockToggle from "@/test/mocks/MockToggle.svelte"

vi.mock("@budibase/bbui", () => ({
  keepOpen: Symbol("keepOpen"),
  ColorPicker: MockColorPicker,
  Body: MockBody,
  ModalContent: MockModalContent,
  Input: MockInput,
  IconPicker: MockIconPicker,
  Toggle: MockToggle,
}))

import CreateEditGroupModal from "./CreateEditGroupModal.svelte"

const buildGroup = (overrides = {}) => ({
  _id: "group-1",
  _rev: "rev-1",
  name: "Actions",
  icon: "UserGroup",
  color: "#336699",
  users: [],
  ...overrides,
})

describe("CreateEditGroupModal", () => {
  it("keeps synced group names read-only while leaving other fields editable", () => {
    render(CreateEditGroupModal, {
      props: {
        group: buildGroup({
          scimInfo: { isSync: true },
        }),
        saveGroup: vi.fn(),
      },
    })

    expect(screen.getByLabelText("Name")).toBeDisabled()
    expect(screen.getByLabelText("Icon")).not.toBeDisabled()
    expect(screen.getByLabelText("Color")).not.toBeDisabled()
  })

  it("allows non-scim groups to edit all exposed fields", () => {
    render(CreateEditGroupModal, {
      props: {
        group: buildGroup(),
        saveGroup: vi.fn(),
      },
    })

    expect(screen.getByLabelText("Name")).not.toBeDisabled()
    expect(screen.getByLabelText("Icon")).not.toBeDisabled()
    expect(screen.getByLabelText("Color")).not.toBeDisabled()
  })
})
