import { TemplateMetadata, TemplateType } from "../../../../constants"
import { TestConfiguration } from "../../../../tests"
import { EmailTemplatePurpose } from "@budibase/types"

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
})
