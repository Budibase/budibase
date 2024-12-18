import { it, expect, describe, vi } from "vitest"
import Dropzone from "./Dropzone.svelte"
import { render, fireEvent } from "@testing-library/svelte"
import { notifications } from "@budibase/bbui"
import { admin } from "@/stores/portal"

vi.spyOn(notifications, "error").mockImplementation(() => {})

describe("Dropzone", () => {
  let instance = null

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("that the Dropzone is rendered", () => {
    instance = render(Dropzone, {})
    expect(instance).toBeDefined()
  })

  it("Ensure the correct error message is shown when uploading the file in cloud", async () => {
    admin.subscribe = vi.fn().mockImplementation(callback => {
      callback({ cloud: true })
      return () => {}
    })
    instance = render(Dropzone, { props: { fileSizeLimit: 1000000 } }) // 1MB
    const fileInput = instance.getByLabelText("Select a file to upload")
    const file = new File(["hello".repeat(2000000)], "hello.png", {
      type: "image/png",
    })
    await fireEvent.change(fileInput, { target: { files: [file] } })
    expect(notifications.error).toHaveBeenCalledWith(
      "Files cannot exceed 1MB. Please try again with smaller files."
    )
  })

  it("Ensure the file size error message is not shown when running on self host", async () => {
    admin.subscribe = vi.fn().mockImplementation(callback => {
      callback({ cloud: false })
      return () => {}
    })
    instance = render(Dropzone, { props: { fileSizeLimit: 1000000 } }) // 1MB
    const fileInput = instance.getByLabelText("Select a file to upload")
    const file = new File(["hello".repeat(2000000)], "hello.png", {
      type: "image/png",
    })
    await fireEvent.change(fileInput, { target: { files: [file] } })
    expect(notifications.error).not.toHaveBeenCalled()
  })
})
