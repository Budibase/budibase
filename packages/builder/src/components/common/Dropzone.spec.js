import { writable } from "svelte/store"
import { it, expect, describe, vi } from "vitest"
import Dropzone from "./Dropzone.svelte"
import { render, fireEvent } from "@testing-library/svelte"
import { notifications } from "@budibase/bbui"
import { admin } from "@/stores/portal"

vi.mock("@/stores/portal", async () => {
  return {
    admin: writable({}),
    auth: writable({}),
  }
})

vi.mock("@/stores/builder", async () => {
  return {
    workspaceAppStore: writable({}),
    appStore: writable({}),
  }
})

const notificationsErrorSpy = vi
  .spyOn(notifications, "error")
  .mockImplementation(() => {})

describe("Dropzone", () => {
  let instance = null

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
    // Ensure admin store has a default value
    admin.set({ cloud: false })
  })

  it("that the Dropzone is rendered", () => {
    instance = render(Dropzone, {})
    expect(instance).toBeDefined()
  })

  it("Ensure the correct error message is shown when uploading the file in cloud", async () => {
    admin.set({ cloud: true })
    instance = render(Dropzone, { props: { fileSizeLimit: 1000000 } }) // 1MB
    const fileInput = instance.getByLabelText("Click to select a file")
    const file = new File(["hello".repeat(2000000)], "hello.png", {
      type: "image/png",
    })
    await fireEvent.change(fileInput, { target: { files: [file] } })
    expect(notificationsErrorSpy).toHaveBeenCalledWith(
      "Files cannot exceed 1MB. Please try again with smaller files."
    )
  })

  it("Ensure the file size error message is not shown when running on self host", async () => {
    admin.set({ cloud: false })
    instance = render(Dropzone, { props: { fileSizeLimit: 1000000 } }) // 1MB
    const fileInput = instance.getByLabelText("Click to select a file")
    const file = new File(["hello".repeat(2000000)], "hello.png", {
      type: "image/png",
    })
    await fireEvent.change(fileInput, { target: { files: [file] } })
    expect(notificationsErrorSpy).not.toHaveBeenCalled()
  })
})
