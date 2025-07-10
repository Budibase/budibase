import { TemplateMetadata, TemplateType } from "../../../../constants"
import { TestConfiguration } from "../../../../tests"
import { EmailTemplatePurpose, Template } from "@budibase/types"
import { addBaseTemplates } from "../../../../constants/templates"
import { tenancy } from "@budibase/backend-core"
import yaml from "yaml"

// TODO

describe("/api/global/template", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/global/template/definitions", () => {
    describe("retrieves definitions", () => {
      it("checks description definitions", async () => {
        let result = await config.api.templates.definitions()

        expect(result.body.info[EmailTemplatePurpose.BASE].description).toEqual(
          TemplateMetadata[TemplateType.EMAIL][0].description
        )
        expect(
          result.body.info[EmailTemplatePurpose.PASSWORD_RECOVERY].description
        ).toEqual(TemplateMetadata[TemplateType.EMAIL][1].description)
        expect(
          result.body.info[EmailTemplatePurpose.WELCOME].description
        ).toEqual(TemplateMetadata[TemplateType.EMAIL][2].description)
        expect(
          result.body.info[EmailTemplatePurpose.INVITATION].description
        ).toEqual(TemplateMetadata[TemplateType.EMAIL][3].description)
        expect(
          result.body.info[EmailTemplatePurpose.CUSTOM].description
        ).toEqual(TemplateMetadata[TemplateType.EMAIL][4].description)
      })

      it("checks description bindings", async () => {
        let result = await config.api.templates.definitions()

        expect(result.body.bindings[EmailTemplatePurpose.BASE]).toEqual(
          TemplateMetadata[TemplateType.EMAIL][0].bindings
        )
        expect(
          result.body.bindings[EmailTemplatePurpose.PASSWORD_RECOVERY]
        ).toEqual(TemplateMetadata[TemplateType.EMAIL][1].bindings)
        expect(result.body.bindings[EmailTemplatePurpose.WELCOME]).toEqual(
          TemplateMetadata[TemplateType.EMAIL][2].bindings
        )
        expect(result.body.bindings[EmailTemplatePurpose.INVITATION]).toEqual(
          TemplateMetadata[TemplateType.EMAIL][3].bindings
        )
        expect(result.body.bindings[EmailTemplatePurpose.CUSTOM]).toEqual(
          TemplateMetadata[TemplateType.EMAIL][4].bindings
        )
      })
    })
  })

  describe("POST /api/global/template", () => {
    it("adds a new template", async () => {
      let purpose = "base"
      let contents = "Test contents"
      let updatedTemplate = {
        contents: contents,
        purpose: purpose,
        type: "email",
      }
      await config.api.templates.saveTemplate(updatedTemplate)
      let res = await config.api.templates.getTemplate()
      let newTemplate = res.body.find((t: any) => (t.purpose = purpose))
      expect(newTemplate.contents).toEqual(contents)
    })
  })

  describe("GET /api/global/template", () => {
    it("fetches templates", async () => {
      let res = await config.api.templates.getTemplate()
      expect(
        res.body.find((t: any) => t.purpose === EmailTemplatePurpose.BASE)
      ).toBeDefined()
      expect(
        res.body.find((t: any) => t.purpose === EmailTemplatePurpose.CUSTOM)
      ).toBeDefined()
      expect(
        res.body.find((t: any) => t.purpose === EmailTemplatePurpose.INVITATION)
      ).toBeDefined()
      expect(
        res.body.find(
          (t: any) => t.purpose === EmailTemplatePurpose.PASSWORD_RECOVERY
        )
      ).toBeDefined()
      expect(
        res.body.find((t: any) => t.purpose === EmailTemplatePurpose.WELCOME)
      ).toBeDefined()
    })
  })

  describe("POST /api/global/template/:type/export - emails", () => {
    let templates: Template[] = []

    beforeAll(async () => {
      addBaseTemplates(templates, "email")

      // Core is not an updatable template and should never be included
      templates = templates.filter(t => t.purpose !== EmailTemplatePurpose.CORE)

      await config.beforeAll()

      const templateResp = await config.api.templates.getTemplate()
      const templateDocs = templateResp.body.filter((t: Template) => t._id)

      // Purge all docs from the previous test blocks
      await config.doInTenant(async () => {
        const db = tenancy.getGlobalDB()
        await db.bulkRemove(templateDocs)
      })
    })

    it("should export all default email templates as yaml", async () => {
      const resp = await config.api.templates.exportTemplates()

      expect(resp.type).toBe("text/yaml")

      const doc = yaml.parse(resp.text)

      // Confirm the export file name
      const disposition = resp.header["content-disposition"]
      expect(disposition).toContain("bb_default_email_templates")

      // All templates type should be present and match the hbs contents.
      const processedTemplates = templates.filter(t => {
        const yamlTemplateContents = doc.templates[t.purpose]
        return t.contents === yamlTemplateContents
      })

      expect(processedTemplates.length).toBe(templates.length)
    })

    it("should export user edited email templates", async () => {
      const customContent = "<div>hello</div>"

      // Alter one of the templates. This creates 1 couch doc, for the custom type
      // All the rest will still contain content from the static hbs files
      await config.api.templates.saveTemplate({
        purpose: EmailTemplatePurpose.CUSTOM,
        contents: customContent,
        type: "email",
      })

      const resp = await config.api.templates.exportTemplates({
        data: {
          type: "custom",
        },
      })

      expect(resp.type).toBe("text/yaml")

      const doc = yaml.parse(resp.text)

      const disposition = resp.header["content-disposition"]
      expect(disposition).toContain("bb_email_templates.yaml")

      // All templates should be present and match both the static and custom contents
      const processedTemplates = templates.filter(t => {
        const yamlTemplateContents = doc.templates[t.purpose]
        // Check the custom contents has been updated
        if (t.purpose === EmailTemplatePurpose.CUSTOM) {
          return yamlTemplateContents === customContent
        }
        return t.contents === yamlTemplateContents
      })

      expect(processedTemplates.length).toBe(templates.length)
    })

    it("should ignore non-email requests", async () => {
      // Only email templates are supported.
      await config.api.templates.exportTemplates(
        { type: "something" },
        { status: 404 }
      )
    })
  })
})
