import { TestConfiguration } from "../../../tests"
import { addBaseTemplates, loadTemplateConfig } from ".."
import { EmailTemplatePurpose, type Template } from "@budibase/types"
import { join } from "path"

describe("Loading yaml email templates", () => {
  const config = new TestConfiguration()
  let consoleSpy: jest.SpyInstance
  let templates: Template[] = []

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {})
  })

  beforeAll(async () => {
    addBaseTemplates(templates, "email")
    // Core is not an updatable template and should never be included
    templates = templates.filter(t => t.purpose !== EmailTemplatePurpose.CORE)

    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("should ignore an invalid path", async () => {
    const testPath = join(__dirname, `./email_templates_wrong_path.yaml`)

    await config.doInTenant(async () => {
      loadTemplateConfig(testPath)
    })

    expect(consoleSpy).toHaveBeenCalledTimes(2)

    // Confirm the error is relayed
    expect(consoleSpy).toHaveBeenCalledWith(
      "There was a problem parsing email templates: ",
      expect.stringContaining("no such file")
    )

    consoleSpy.mockRestore()
  })

  it("should ignore empty contents", async () => {
    // Valid path but its empty.
    const testPath = join(__dirname, `./email_templates_empty.yaml`)

    await config.doInTenant(async () => {
      await loadTemplateConfig(testPath)
    })

    expect(consoleSpy).toHaveBeenCalledTimes(2)
    expect(consoleSpy).toHaveBeenCalledWith(
      `No email templates found: ${testPath}`
    )

    consoleSpy.mockRestore()
  })

  it("should detect and ignore invalid yaml content", async () => {
    const testPath = join(__dirname, `./email_templates_invalid.yaml`)

    await config.doInTenant(async () => {
      await loadTemplateConfig(testPath)
    })

    expect(consoleSpy).toHaveBeenCalledTimes(2)
    // Confirm the error is relayed - there is an unclosed string in the test doc
    expect(consoleSpy).toHaveBeenCalledWith(
      "There was a problem parsing email templates: ",
      expect.stringContaining("Missing closing")
    )
    consoleSpy.mockRestore()
  })

  it("should process valid yaml content", async () => {
    // welcome and custom modified, invitation was excluded
    const testPath = join(__dirname, `./email_templates.yaml`)

    const templatesBeforeResp = await config.api.templates.getTemplate()
    const templatesBefore = templatesBeforeResp.body.reduce(
      (acc: Record<string, any>, t: any) => {
        if (t.purpose === EmailTemplatePurpose.CORE) return acc
        acc[t.purpose] ??= t
        return acc
      },
      {}
    )

    await config.doInTenant(async () => {
      await loadTemplateConfig(testPath)
    })

    const templatesUpdatedResp = await config.api.templates.getTemplate()
    const templatesUpdated = templatesUpdatedResp.body.filter(
      (t: any) => t.purpose !== EmailTemplatePurpose.CORE
    )

    expect(templatesUpdated.length).toBe(templates.length)

    // Confirm the changes have been applied and the templates are persisted
    const processedTemplates = templatesUpdated.filter((t: any) => {
      if (
        (t._id &&
          t.purpose === EmailTemplatePurpose.CUSTOM &&
          t.contents === "<div>altered</div>") ||
        (t._id &&
          t.purpose === EmailTemplatePurpose.WELCOME &&
          t.contents === "<div>welcome altered</div>")
      ) {
        return true
      }
      // All others are the same.
      return templatesBefore[t.purpose].contents === t.contents
    })

    expect(processedTemplates.length).toBe(templates.length)

    // Should notify that the two templates that didn't match were in actually persisted.
    expect(consoleSpy).toHaveBeenCalledTimes(2)
    expect(consoleSpy).toHaveBeenCalledWith(
      `Email templates updated: welcome,custom`
    )

    consoleSpy.mockRestore()
  })

  it("should only update template docs when the contents has changed", async () => {
    // welcome and custom modified, invitation was excluded
    const testPath = join(__dirname, `./email_templates.yaml`)

    const templatesBeforeResp = await config.api.templates.getTemplate()
    const templatesBefore = templatesBeforeResp.body.reduce(
      (acc: Record<string, any>, t: any) => {
        if (t.purpose === EmailTemplatePurpose.CORE) return acc
        acc[t.purpose] ??= t
        return acc
      },
      {}
    )

    // Update the templates. welcome and custom are persisted to couch
    await config.doInTenant(async () => {
      await loadTemplateConfig(testPath)
    })
    consoleSpy.mockReset()

    // Run the update again. Simulating a restart of the worker.
    await config.doInTenant(async () => {
      await loadTemplateConfig(testPath)
    })

    const templatesUpdatedResp = await config.api.templates.getTemplate()
    const templatesUpdated = templatesUpdatedResp.body.filter(
      (t: any) => t.purpose !== EmailTemplatePurpose.CORE
    )

    expect(templatesUpdated.length).toBe(templates.length)

    const processedTemplates = templatesUpdated.filter((t: any) => {
      // All content unchanged
      return templatesBefore[t.purpose].contents === t.contents
    })

    expect(processedTemplates.length).toBe(templates.length)

    expect(consoleSpy).toHaveBeenCalledTimes(2)
    // Should confirm that on reprocessing, the templates were not persisted
    expect(consoleSpy).toHaveBeenCalledWith(`Email templates unchanged`)

    consoleSpy.mockRestore()
  })
})
