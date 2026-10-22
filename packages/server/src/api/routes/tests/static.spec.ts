import { constants, objectStore, roles } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { encodeJSBinding } from "@budibase/string-templates"
import {
  BasicOperator,
  BuiltinPermissionID,
  type Component,
  FieldType,
  PermissionLevel,
  Datasource,
  Feature,
  Screen,
  SourceName,
} from "@budibase/types"
import fsp from "fs/promises"
import path from "path"
import { tmpdir } from "os"
import { generateUserMetadataID } from "../../../db/utils"
import env, { setEnv } from "../../../environment"
import * as fileSystem from "../../../utilities/fileSystem"
import {
  afterAll as _afterAll,
  getConfig,
  getRequest,
  structures,
} from "./utilities"

jest.mock("extract-zip", () => jest.fn())

jest.mock("../../../utilities/fileSystem", () => {
  const actual = jest.requireActual("../../../utilities/fileSystem")
  return {
    ...actual,
    shouldServeLocally: jest.fn(actual.shouldServeLocally),
  }
})

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getProdWorkspaceId: jest.fn().mockReturnValue("app_prod_test123"),
    },
    objectStore: {
      ...actual.objectStore,
      upload: jest.fn(),
    },
  }
})

import extract from "extract-zip"

const mockedUpload = objectStore.upload as jest.MockedFunction<
  typeof objectStore.upload
>
const mockedExtract = extract as jest.MockedFunction<typeof extract>

describe("/static", () => {
  let request = getRequest()
  let config = getConfig()
  let cleanupEnv: () => void

  afterAll(() => {
    _afterAll()
    cleanupEnv()
  })

  beforeAll(async () => {
    cleanupEnv = setEnv({ SELF_HOSTED: "true" })
    await config.init()
  })

  describe("/app", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should serve the app by url", async () => {
      const headers = config.defaultHeaders()
      delete headers[constants.Header.WORKSPACE_ID]
      const workspaceId = config.getProdWorkspaceId()

      const res = await request
        .get(`/app${config.getProdWorkspace().url}`)
        .set(headers)
        .expect(200)

      expect(res.body.appId).toBe(workspaceId)
      expect(res.body.clientLibPath).toContain(
        `/api/assets/${workspaceId}/client?`
      )
    })

    it("should serve the app preview by id", async () => {
      const res = await request
        .get(`/${config.devWorkspaceId}`)
        .set(config.defaultHeaders())
        .expect(200)

      expect(res.body.appId).toBe(config.devWorkspaceId)
    })

    describe("app scripts", () => {
      beforeAll(async () => {
        await config.api.workspace.update(config.getDevWorkspaceId(), {
          scripts: [
            {
              id: "head-script",
              name: "Head script",
              location: "Head",
              html: '<script id="custom-head-script">window.customHead = true</script><style id="custom-style">body { color: red }</style>',
              cspWhitelist: "https://example.com",
            },
            {
              id: "body-script",
              name: "Body script",
              location: "Body",
              html: '<script id="custom-body-script">window.customBody = true</script>',
            },
          ],
        })
        await config.publish()
      })

      afterEach(() => {
        jest.restoreAllMocks()
        mocks.licenses.useUnlimited()
      })

      const fetchAppScripts = async ({
        authenticated,
        licensed,
      }: {
        authenticated: boolean
        licensed: boolean
      }) => {
        mocks.licenses.useUnlimited({
          features: licensed ? [Feature.CUSTOM_APP_SCRIPTS] : [],
        })
        jest.spyOn(env, "isJest").mockReturnValue(false)
        const headers = config.defaultHeaders()
        delete headers[constants.Header.WORKSPACE_ID]
        if (!authenticated) {
          delete headers.Cookie
        }

        return await request
          .get(`/app${config.getProdWorkspace().url}`)
          .set(headers)
      }

      it("renders scripts and CSP for licensed public users", async () => {
        const res = await fetchAppScripts({
          authenticated: false,
          licensed: true,
        })

        expect(res.text).toContain('id="custom-head-script"')
        expect(res.text).toContain('id="custom-body-script"')
        expect(res.text).toContain('id="custom-style"')
        expect(res.headers["content-security-policy"]).toContain(
          "https://example.com"
        )
      })

      it("renders scripts and CSP for licensed authenticated users", async () => {
        const res = await fetchAppScripts({
          authenticated: true,
          licensed: true,
        })

        expect(res.text).toContain('id="custom-head-script"')
        expect(res.text).toContain('id="custom-body-script"')
        expect(res.text).toContain('id="custom-style"')
        expect(res.headers["content-security-policy"]).toContain(
          "https://example.com"
        )
      })

      it("omits scripts and CSP whitelist entries for unlicensed public users", async () => {
        const res = await fetchAppScripts({
          authenticated: false,
          licensed: false,
        })

        expect(res.status).toBe(200)
        expect(res.text).not.toContain('id="custom-head-script"')
        expect(res.text).not.toContain('id="custom-body-script"')
        expect(res.text).not.toContain('id="custom-style"')
        expect(res.headers["content-security-policy"]).not.toContain(
          "https://example.com"
        )
      })

      it("omits scripts and CSP whitelist entries for unlicensed authenticated users", async () => {
        const res = await fetchAppScripts({
          authenticated: true,
          licensed: false,
        })

        expect(res.status).toBe(200)
        expect(res.text).not.toContain('id="custom-head-script"')
        expect(res.text).not.toContain('id="custom-body-script"')
        expect(res.text).not.toContain('id="custom-style"')
        expect(res.headers["content-security-policy"]).not.toContain(
          "https://example.com"
        )
      })
    })
  })

  describe("/attachments", () => {
    describe("generateSignedUrls", () => {
      let datasource: Datasource
      let screen: Screen
      let uploadComponent: Component
      const componentId = "s3-upload-component"

      beforeEach(async () => {
        datasource = await config.createDatasource({
          datasource: {
            type: "datasource",
            name: "Test",
            source: SourceName.S3,
            config: {
              accessKeyId: "bb",
              secretAccessKey: "bb",
            },
          },
        })
        const screenDefinition = structures.basicScreen()
        uploadComponent = {
          _id: componentId,
          _instanceName: "S3 upload",
          _styles: {},
          _component: "@budibase/standard-components/s3upload",
          datasourceId: datasource._id,
          bucket: "foo",
          key: "uploads/{{ fileName }}",
        }
        screenDefinition.props._children?.push(uploadComponent)
        screen = await config.createScreen(screenDefinition)
        await config.publish()
      })

      const configureUpload = async ({
        extra = {},
        definition = structures.basicScreen(),
      }: {
        extra?: Partial<Component>
        definition?: Screen
      }) => {
        definition.props._children = [{ ...uploadComponent, ...extra }]
        const saved = await config.createScreen(definition)
        await config.publish()
        return saved
      }

      it("should reject a user-created row used as a screen", async () => {
        const table = await config.createTable(
          structures.basicTable(undefined, {
            schema: { props: { name: "props", type: FieldType.JSON } },
          })
        )
        await config.api.permission.add({
          roleId: roles.BUILTIN_ROLE_IDS.BASIC,
          resourceId: table._id!,
          level: PermissionLevel.WRITE,
        })
        await config.publish()
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          const row = await config.api.row.save(table._id!, {
            tableId: table._id!,
            props: {
              ...uploadComponent,
              bucket: "attacker-chosen-bucket",
              key: "arbitrary/existing-object.pdf",
            },
          })
          await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "attacker-chosen-bucket",
              key: "arbitrary/existing-object.pdf",
              componentId,
              screenId: row._id,
            })
            .set(config.defaultHeaders())
            .expect(403)
        })
      })

      it("should reject a layout ID used as a screen", async () => {
        const definition = structures.basicLayout()
        definition.props._children = [uploadComponent]
        const layout = await config.createLayout(definition)
        const restrictedScreen = structures.powerScreen("/restricted-layout")
        restrictedScreen.layoutId = layout._id
        await config.createScreen(restrictedScreen)
        await config.publish()
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "uploads/file.pdf",
              componentId,
              screenId: layout._id,
            })
            .set(config.defaultHeaders())
            .expect(403)
        })
      })

      it("should allow a layout component through an accessible screen", async () => {
        const definition = structures.basicLayout()
        definition.props._children = [uploadComponent]
        const layout = await config.createLayout(definition)
        const screenDefinition = structures.basicScreen("/layout-upload")
        screenDefinition.layoutId = layout._id
        const layoutScreen = await config.createScreen(screenDefinition)
        await config.publish()
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          const res = await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "uploads/file.pdf",
              componentId,
              screenId: layoutScreen._id,
            })
            .set(config.defaultHeaders())
            .expect(200)
          expect(res.body.signedUrl).toBeDefined()
        })
      })

      it.each([
        { setting: "bucket", settingValue: "restricted-bucket" },
        { setting: "datasourceId", settingValue: "another-datasource" },
        { setting: "key", settingValue: "restricted/{{ fileName }}" },
      ])(
        "should reject destinations controlled by a $setting condition",
        async ({ setting, settingValue }) => {
          const conditionalScreen = await configureUpload({
            extra: {
              _conditions: [
                {
                  id: "destination-condition",
                  action: "update",
                  setting,
                  settingValue,
                  operator: BasicOperator.EQUAL,
                  type: FieldType.STRING,
                  valueType: "string",
                  newValue: "BASIC",
                  referenceValue: "ADMIN",
                },
              ],
            },
          })
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "foo",
                key: "uploads/file.pdf",
                componentId,
                screenId: conditionalScreen._id,
              })
              .set(config.defaultHeaders())
              .expect(403)
          })
        }
      )

      it("should reject mixing an inactive conditional bucket with the default key", async () => {
        const conditionalScreen = await configureUpload({
          extra: {
            _conditions: [
              {
                id: "bucket-condition",
                action: "update",
                setting: "bucket",
                settingValue: "restricted-bucket",
                operator: BasicOperator.EQUAL,
                type: FieldType.STRING,
                valueType: "string",
                newValue: "BASIC",
                referenceValue: "ADMIN",
              },
              {
                id: "key-condition",
                action: "update",
                setting: "key",
                settingValue: "admin/{{ fileName }}",
                operator: BasicOperator.EQUAL,
                type: FieldType.STRING,
                valueType: "string",
                newValue: "BASIC",
                referenceValue: "ADMIN",
              },
            ],
          },
        })
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "restricted-bucket",
              key: "uploads/file.pdf",
              componentId,
              screenId: conditionalScreen._id,
            })
            .set(config.defaultHeaders())
            .expect(403)
        })
      })

      it("should allow disabled destination conditions and unrelated UI conditions", async () => {
        const conditionalScreen = await configureUpload({
          extra: {
            _conditions: [
              {
                id: "disabled",
                disabled: true,
                action: "update",
                setting: "bucket",
                settingValue: "other-bucket",
                operator: BasicOperator.EQUAL,
                type: FieldType.STRING,
                valueType: "string",
                newValue: "BASIC",
                referenceValue: "ADMIN",
              },
              {
                id: "label",
                action: "update",
                setting: "label",
                settingValue: "Upload",
                operator: BasicOperator.EQUAL,
                type: FieldType.STRING,
                valueType: "string",
                newValue: "BASIC",
                referenceValue: "BASIC",
              },
            ],
          },
        })
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "uploads/file.pdf",
              componentId,
              screenId: conditionalScreen._id,
            })
            .set(config.defaultHeaders())
            .expect(200)
        })
      })

      it.each([true, false])(
        "should enforce the current user's directory (own user: %s)",
        async ownUser => {
          const userScreen = await configureUpload({
            extra: {
              key: "users/{{ [user].[_id] }}/{{ fileName }}",
            },
          })
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            const userId = ownUser
              ? generateUserMetadataID(config.getUser()._id)
              : "another-user"
            await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "foo",
                key: `users/${userId}/file.pdf`,
                componentId,
                screenId: userScreen._id,
              })
              .set(config.defaultHeaders())
              .expect(ownUser ? 200 : 403)
          })
        }
      )

      it("should allow a filename binding at the bucket root", async () => {
        const filenameScreen = await configureUpload({
          extra: { key: "{{ fileName }}" },
        })
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          const res = await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "file.pdf",
              componentId,
              screenId: filenameScreen._id,
            })
            .set(config.defaultHeaders())
            .expect(200)
          expect(res.body.publicUrl).toBe(
            "https://foo.s3.eu-west-1.amazonaws.com/file.pdf"
          )
        })
      })

      it.each([
        { key: "a".repeat(1025) },
        { key: "é".repeat(513) },
        { key: ["uploads/file.pdf"] },
        { bucket: ["foo"] },
        { screenId: { id: "screen" } },
        { componentId: 42 },
      ])(
        "should reject invalid upload parameters (case %#)",
        async overrides => {
          await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "uploads/file.pdf",
              componentId,
              screenId: screen._id,
              ...overrides,
            })
            .set(config.defaultHeaders())
            .expect(400)
        }
      )

      it("should be able to generate a signed upload URL", async () => {
        const bucket = "foo"
        const key = "bar"
        const res = await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket,
            key: `uploads/${key}`,
            componentId,
            screenId: screen._id,
          })
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)

        expect(res.body.signedUrl).toStartWith(
          "https://foo.s3.eu-west-1.amazonaws.com/uploads/bar?"
        )
        expect(res.body.signedUrl).toContain("X-Amz-Algorithm=AWS4-HMAC-SHA256")
        expect(res.body.signedUrl).toContain("X-Amz-Credential=bb")
        expect(res.body.signedUrl).toContain("X-Amz-Date=")
        expect(res.body.signedUrl).toContain("X-Amz-Signature=")
        expect(res.body.signedUrl).toContain("X-Amz-Expires=900")
        expect(res.body.signedUrl).toContain("X-Amz-SignedHeaders=host")
        expect(res.body.signedUrl).not.toContain("x-amz-checksum")

        expect(res.body.publicUrl).toEqual(
          `https://${bucket}.s3.eu-west-1.amazonaws.com/uploads/${key}`
        )
      })

      it("should sign uploads with an empty optional filename suffix", async () => {
        const configuredScreen = await configureUpload({
          extra: { key: "uploads/{{ name }}-{{ suffix }}.pdf" },
        })
        const res = await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket: "foo",
            key: "uploads/report-.pdf",
            componentId,
            screenId: configuredScreen._id,
          })
          .set(config.defaultHeaders())
          .expect(200)

        expect(res.body.signedUrl).toStartWith(
          "https://foo.s3.eu-west-1.amazonaws.com/uploads/report-.pdf?"
        )
      })

      it.each([
        {
          configuredBucket: encodeJSBinding('return "foo"'),
          configuredFileName: encodeJSBinding('return "test.jpg"'),
          requestedKey: "test.jpg",
        },
        {
          configuredBucket: encodeJSBinding('return "foo"'),
          configuredFileName: encodeJSBinding(`
            const reportLabel = new Date().getTime() + "_" + helpers.pluck($("ReportForm.Fields.Files"), "name")
            const studyCode = $("StudiesDP.Rows.0.study_code")
            return "ResearchArchive/" + studyCode + "/Reports/" + reportLabel
          `),
          requestedKey:
            "ResearchArchive/study-42/Reports/1700000000000_notes.pdf",
        },
      ])(
        "should sign JavaScript filename uploads for BASIC users (case %#)",
        async ({ configuredBucket, configuredFileName, requestedKey }) => {
          const configuredScreen = await configureUpload({
            extra: { bucket: configuredBucket, key: configuredFileName },
          })
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            const res = await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "foo",
                key: requestedKey,
                componentId,
                screenId: configuredScreen._id,
              })
              .set(config.defaultHeaders())
              .expect(200)

            expect(res.body.signedUrl).toStartWith(
              `https://foo.s3.eu-west-1.amazonaws.com/${requestedKey}?`
            )
            expect(res.body.signedUrl).toContain("X-Amz-Signature=")
            expect(res.body.publicUrl).toBe(
              `https://foo.s3.eu-west-1.amazonaws.com/${requestedKey}`
            )
          })
        }
      )

      it.each([
        {
          endpoint: undefined,
          publicUrlPrefix: "https://foo.s3.eu-west-1.amazonaws.com",
        },
        {
          endpoint: "https://s3.example.com",
          publicUrlPrefix: "https://s3.example.com/foo",
        },
      ])(
        "should encode JavaScript upload keys in public URLs (case %#)",
        async ({ endpoint, publicUrlPrefix }) => {
          await config.api.datasource.update({
            ...datasource,
            config: { ...datasource.config, endpoint },
          })
          const requestedKey =
            "Research Archive/study-42/Reports/report#1? 50% café.pdf"
          const configuredScreen = await configureUpload({
            extra: {
              key: encodeJSBinding(`return ${JSON.stringify(requestedKey)}`),
            },
          })
          const encodedKey =
            "Research%20Archive/study-42/Reports/report%231%3F%2050%25%20caf%C3%A9.pdf"
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            const res = await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "foo",
                key: requestedKey,
                componentId,
                screenId: configuredScreen._id,
              })
              .set(config.defaultHeaders())
              .expect(200)

            expect(new URL(res.body.signedUrl).pathname).toBe(`/${encodedKey}`)
            expect(res.body.publicUrl).toBe(`${publicUrlPrefix}/${encodedKey}`)
          })
        }
      )

      it.each([
        { bucket: "other-bucket" },
        { componentId: "other-component" },
        { screenId: "screen_missing" },
      ])(
        "should preserve destination authorization for JavaScript uploads (case %#)",
        async overrides => {
          const configuredScreen = await configureUpload({
            extra: { key: encodeJSBinding('return "test.jpg"') },
          })
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "foo",
                key: "test.jpg",
                componentId,
                screenId: configuredScreen._id,
                ...overrides,
              })
              .set(config.defaultHeaders())
              .expect(403)
          })
        }
      )

      it("should handle an invalid datasource ID", async () => {
        const res = await request
          .post(`/api/attachments/foo/url`)
          .send({
            bucket: "foo",
            key: "bar",
            componentId,
            screenId: screen._id,
          })
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(400)
        expect(res.body.message).toEqual(
          "The specified datasource could not be found"
        )
      })

      it("should require authorization to generate a signed upload URL", async () => {
        const publicScreen = await configureUpload({
          definition: structures.customScreen({
            roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
            route: "/public-upload",
          }),
        })
        await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket: "foo",
            key: "uploads/bar",
            componentId,
            screenId: publicScreen._id,
          })
          .set(config.publicHeaders())
          .expect("Content-Type", /json/)
          .expect(401)
      })

      it.each([
        { bucket: "foo", roleName: "s3_signed_url_read_only_literal" },
        {
          bucket: "{{ [settings].[bucketName] }}",
          roleName: "s3_signed_url_read_only_binding",
        },
      ])(
        "should deny app users without write permissions for bucket $bucket",
        async ({ bucket, roleName }) => {
          const readOnlyRole = await config.api.roles.save({
            name: roleName,
            permissionId: BuiltinPermissionID.READ_ONLY,
            inherits: roles.BUILTIN_ROLE_IDS.PUBLIC,
          })
          await config.api.permission.add({
            roleId: readOnlyRole._id!,
            resourceId: datasource._id!,
            level: PermissionLevel.READ,
          })
          const accessibleScreen = await configureUpload({
            definition: structures.customScreen({
              roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
              route: "/read-only-upload",
            }),
            extra: { bucket },
          })
          await config.loginAsRole(readOnlyRole._id!, async () => {
            await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "foo",
                key: "uploads/bar",
                componentId,
                screenId: accessibleScreen._id,
              })
              .set(config.defaultHeaders())
              .expect("Content-Type", /json/)
              .expect(403)
          })
        }
      )

      it("should require a bucket parameter", async () => {
        const res = await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket: undefined,
            key: "bar",
            componentId,
            screenId: screen._id,
          })
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(400)
        expect(res.body.message).toEqual("bucket and key values are required")
      })

      it("should require a key parameter", async () => {
        const res = await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket: "foo",
            componentId,
            screenId: screen._id,
          })
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(400)
        expect(res.body.message).toEqual("bucket and key values are required")
      })

      it("should reject buckets that do not match the S3 upload component", async () => {
        await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket: "other-bucket",
            key: "uploads/bar",
            componentId,
            screenId: screen._id,
          })
          .set(config.defaultHeaders())
          .expect(403)
      })

      it.each([
        "{{ [settings].[bucketName] }}",
        "{{ [form].[Bucket] }}",
        "{{ [query].[rows].[0].[bucket] }}",
        "{{ user.department }}",
        "{{ lowercase [settings].[bucketName] }}",
        "{{#if [settings].[archive]}}archive{{else}}uploads{{/if}}",
        encodeJSBinding("return $('State.bucketName')"),
      ])(
        "should allow BASIC users to select buckets through saved binding %s",
        async bucket => {
          const configuredScreen = await configureUpload({ extra: { bucket } })
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            const res = await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "selected-bucket",
                key: "uploads/report.pdf",
                componentId,
                screenId: configuredScreen._id,
              })
              .set(config.defaultHeaders())
              .expect(200)

            expect(res.body.signedUrl).toStartWith(
              "https://selected-bucket.s3.eu-west-1.amazonaws.com/uploads/report.pdf?"
            )
            expect(res.body.publicUrl).toEqual(
              "https://selected-bucket.s3.eu-west-1.amazonaws.com/uploads/report.pdf"
            )
          })
        }
      )

      it.each([
        { template: "uploads-{{ region }}", bucket: "uploads-eu", status: 200 },
        {
          template: "uploads-{{ region }}",
          bucket: "sensitive-eu",
          status: 403,
        },
        {
          template: "uploads-{{ region }}-private",
          bucket: "uploads-eu-public",
          status: 403,
        },
        {
          template: "{{ region }}-uploads-{{ tenant }}",
          bucket: "eu-sensitive-team",
          status: 403,
        },
        {
          template: "uploads-{{ lowercase region }}",
          bucket: "selected-bucket",
          status: 200,
        },
        {
          template: "uploads-{{ region }}-{{ lowercase tenant }}",
          bucket: "selected-bucket",
          status: 200,
        },
      ])(
        "should enforce simple bucket patterns and retain complex bindings (case %#)",
        async ({ template, bucket, status }) => {
          const configuredScreen = await configureUpload({
            extra: { bucket: template },
          })
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket,
                key: "uploads/report.pdf",
                componentId,
                screenId: configuredScreen._id,
              })
              .set(config.defaultHeaders())
              .expect(status)
          })
        }
      )

      it.each([
        { key: "other/report.pdf" },
        { key: "uploads/nested/report.pdf" },
        { componentId: "other-component" },
        { screenId: "screen_missing" },
      ])(
        "should retain upload restrictions for bucket bindings (case %#)",
        async overrides => {
          const configuredScreen = await configureUpload({
            extra: { bucket: "{{ [settings].[bucketName] }}" },
          })
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "selected-bucket",
                key: "uploads/report.pdf",
                componentId,
                screenId: configuredScreen._id,
                ...overrides,
              })
              .set(config.defaultHeaders())
              .expect(403)
          })
        }
      )

      it("should reject datasources that do not match the S3 upload component", async () => {
        const otherDatasource = await config.createDatasource({
          datasource: {
            type: "datasource",
            name: "Other S3 datasource",
            source: SourceName.S3,
            config: {
              accessKeyId: "bb",
              secretAccessKey: "bb",
            },
          },
        })

        await request
          .post(`/api/attachments/${otherDatasource._id}/url`)
          .send({
            bucket: "foo",
            key: "uploads/bar",
            componentId,
            screenId: screen._id,
          })
          .set(config.defaultHeaders())
          .expect(403)
      })

      it("should reject keys outside the S3 upload component pattern", async () => {
        await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket: "foo",
            key: "other/bar",
            componentId,
            screenId: screen._id,
          })
          .set(config.defaultHeaders())
          .expect(403)
      })

      it("should reject path separators supplied by a dynamic key value", async () => {
        await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket: "foo",
            key: "uploads/nested/bar",
            componentId,
            screenId: screen._id,
          })
          .set(config.defaultHeaders())
          .expect(403)
      })

      it("should reject a component that is not configured for the upload", async () => {
        await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket: "foo",
            key: "uploads/bar",
            componentId: "other-component",
            screenId: screen._id,
          })
          .set(config.defaultHeaders())
          .expect(403)
      })

      it("should reject components on screens the app user cannot access", async () => {
        const restrictedScreenDefinition = structures.powerScreen("/restricted")
        restrictedScreenDefinition.props._children?.push({
          _id: componentId,
          _instanceName: "Restricted S3 upload",
          _styles: {},
          _component: "@budibase/standard-components/s3upload",
          datasourceId: datasource._id,
          bucket: "foo",
          key: "uploads/{{ fileName }}",
        })
        const restrictedScreen = await config.createScreen(
          restrictedScreenDefinition
        )
        await config.publish()

        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "uploads/bar",
              componentId,
              screenId: restrictedScreen._id,
            })
            .set(config.defaultHeaders())
            .expect(403)
        })
      })

      it.each([
        { template: "bar", key: "bar" },
        { template: "uploads/{{ fileName }}", key: "uploads/bar" },
      ])(
        "should allow non-creator app users to upload to $template",
        async ({ template, key }) => {
          const uploadScreen = await configureUpload({
            extra: { key: template },
          })
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            const res = await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "foo",
                key,
                componentId,
                screenId: uploadScreen._id,
              })
              .set(config.defaultHeaders())
              .expect("Content-Type", /json/)
              .expect(200)

            expect(res.body.signedUrl).toContain("X-Amz-Signature=")
            expect(res.body.signedUrl).toContain("x-id=PutObject")
            expect(res.body.signedUrl).not.toContain("x-amz-checksum")
            expect(res.body.publicUrl).toEqual(
              `https://foo.s3.eu-west-1.amazonaws.com/${key}`
            )
          })
        }
      )

      it("should apply datasource-specific write permissions to BASIC users", async () => {
        await config.api.permission.add({
          roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
          resourceId: datasource._id!,
          level: PermissionLevel.WRITE,
        })
        await config.publish()
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "uploads/file.pdf",
              componentId,
              screenId: screen._id,
            })
            .set(config.defaultHeaders())
            .expect(403)
        })
      })

      it("should allow a custom app role explicitly granted datasource write permission", async () => {
        const role = await config.api.roles.save({
          name: "s3_upload_writer",
          permissionId: BuiltinPermissionID.READ_ONLY,
          inherits: roles.BUILTIN_ROLE_IDS.PUBLIC,
        })
        await config.api.permission.add({
          roleId: role._id!,
          resourceId: datasource._id!,
          level: PermissionLevel.WRITE,
        })
        const uploadScreen = await configureUpload({
          definition: structures.customScreen({
            roleId: role._id!,
            route: "/custom-role-upload",
          }),
        })
        await config.loginAsRole(role._id!, async () => {
          const res = await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "uploads/file.pdf",
              componentId,
              screenId: uploadScreen._id,
            })
            .set(config.defaultHeaders())
            .expect(200)
          expect(res.body.signedUrl).toContain("X-Amz-Signature=")
        })
      })

      it.each([
        { bucket: "other-bucket" },
        { key: "other/file.pdf" },
        { key: "uploads/nested/file.pdf" },
        { componentId: "other-component" },
        { componentId: undefined, screenId: undefined },
      ])(
        "should reject BASIC-user destination tampering (case %#)",
        async overrides => {
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            await request
              .post(`/api/attachments/${datasource._id}/url`)
              .send({
                bucket: "foo",
                key: "uploads/file.pdf",
                componentId,
                screenId: screen._id,
                ...overrides,
              })
              .set(config.defaultHeaders())
              .expect("screenId" in overrides ? 400 : 403)
          })
        }
      )
    })
  })

  describe("/app/:appId/preview", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should serve the builder preview", async () => {
      const headers = config.defaultHeaders()
      const res = await request
        .get(`/app/${config.getDevWorkspaceId()}/preview`)
        .set(headers)
        .expect(200)

      expect(res.body.appId).toBe(config.devWorkspaceId)
      expect(res.body.builderPreview).toBe(true)
    })
  })

  describe("/api/assets/:appId/client", () => {
    it("should serve the global client library without an app ID header", async () => {
      const headers = config.defaultHeaders()
      delete headers[constants.Header.WORKSPACE_ID]
      const shouldServeLocallyMock =
        fileSystem.shouldServeLocally as jest.MockedFunction<
          typeof fileSystem.shouldServeLocally
        >
      shouldServeLocallyMock.mockClear()
      const getReadStreamSpy = jest.spyOn(objectStore, "getReadStream")

      try {
        const res = await request
          .get("/api/assets/global/client")
          .set(headers)
          .expect(200)

        expect(res.headers["content-type"]).toContain("javascript")
        expect(shouldServeLocallyMock).not.toHaveBeenCalled()
        expect(getReadStreamSpy).not.toHaveBeenCalled()
      } finally {
        getReadStreamSpy.mockRestore()
      }
    })
  })

  describe("/", () => {
    it("should move permanently from base call (public call)", async () => {
      const res = await request.get(`/`)
      expect(res.status).toEqual(301)
      expect(res.text).toEqual("Redirecting to /builder.")
    })

    it("should not error when trying to get 'apple-touch-icon.png' (public call)", async () => {
      const res = await request.get(`/apple-touch-icon.png`)
      expect(res.status).toEqual(302)
      expect(res.text).toEqual("Redirecting to /builder/bblogo.png.")
    })
  })

  describe("processPWAZip", () => {
    let tempDir: string

    beforeEach(async () => {
      jest.clearAllMocks()
      tempDir = path.join(tmpdir(), `pwa-test-${Date.now()}`)
      await fsp.mkdir(tempDir, { recursive: true })

      mockedExtract.mockImplementation(async (_zipPath: string, opts: any) => {
        await fsp.mkdir(opts.dir, { recursive: true })
        await fsp.cp(tempDir, opts.dir, { recursive: true })
      })
    })

    afterEach(async () => {
      await fsp.rm(tempDir, { recursive: true, force: true })
    })

    it("uses a unique temp directory for each concurrent request", async () => {
      const capturedDirs: string[] = []
      const dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(1000)

      mockedExtract.mockImplementation(async (_zipPath: string, opts: any) => {
        capturedDirs.push(opts.dir)
        await fsp.mkdir(opts.dir, { recursive: true })
        await fsp.writeFile(
          path.join(opts.dir, "icons.json"),
          JSON.stringify({
            icons: [
              {
                src: "icon-192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          })
        )
        await fsp.writeFile(
          path.join(opts.dir, "icon-192.png"),
          "fake-png-data"
        )
      })
      mockedUpload.mockResolvedValue({
        Key: "app_prod_test123/pwa/some-uuid.png",
      } as any)

      try {
        const [firstResponse, secondResponse] = await Promise.all([
          request
            .post("/api/pwa/process-zip")
            .attach("file", Buffer.from("fake-zip"), "icons.zip")
            .set(config.defaultHeaders()),
          request
            .post("/api/pwa/process-zip")
            .attach("file", Buffer.from("fake-zip"), "icons.zip")
            .set(config.defaultHeaders()),
        ])

        expect(firstResponse.status).toEqual(200)
        expect(secondResponse.status).toEqual(200)
        expect([...new Set(capturedDirs)]).toHaveLength(2)
      } finally {
        dateNowSpy.mockRestore()
      }
    })

    describe("path traversal prevention", () => {
      it("skips icons whose src attempts to escape the zip directory via ../ traversal", async () => {
        const sensitiveDir = path.join(tmpdir(), `sensitive-${Date.now()}`)
        await fsp.mkdir(sensitiveDir, { recursive: true })
        const sensitiveFile = path.join(sensitiveDir, "secret.png")
        await fsp.writeFile(sensitiveFile, "sensitive-data")

        try {
          const relativePath = path.relative(tempDir, sensitiveFile)
          const iconsJson = {
            icons: [
              {
                src: relativePath, // e.g. "../../sensitive-.../secret.png"
                sizes: "192x192",
                type: "image/png",
              },
            ],
          }
          await fsp.writeFile(
            path.join(tempDir, "icons.json"),
            JSON.stringify(iconsJson)
          )

          const res = await request
            .post("/api/pwa/process-zip")
            .attach("file", Buffer.from("fake-zip"), "icons.zip")
            .set(config.defaultHeaders())

          expect(res.status).toEqual(400)
          expect(res.body.message).toMatch(
            "No valid icons found in the zip file"
          )
          expect(mockedUpload).not.toHaveBeenCalled()
        } finally {
          await fsp.rm(sensitiveDir, { recursive: true, force: true })
        }
      })

      it("accepts icons whose src stays within the zip directory", async () => {
        const iconFile = path.join(tempDir, "icon-192.png")
        await fsp.writeFile(iconFile, "fake-png-data")

        const iconsJson = {
          icons: [
            {
              src: "icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        }
        await fsp.writeFile(
          path.join(tempDir, "icons.json"),
          JSON.stringify(iconsJson)
        )

        mockedUpload.mockResolvedValue({
          Key: "app_prod_test123/pwa/some-uuid.png",
        } as any)

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())
          .expect(200)

        expect(mockedUpload).toHaveBeenCalledTimes(1)
        expect(res.body.icons).toEqual([
          {
            src: "app_prod_test123/pwa/some-uuid.png",
            sizes: "192x192",
            type: "image/png",
          },
        ])
      })

      it("accepts a manifest.json zip layout", async () => {
        const iconFile = path.join(tempDir, "images", "icon-192.png")
        await fsp.mkdir(path.dirname(iconFile), { recursive: true })
        await fsp.writeFile(iconFile, "fake-png-data")

        const manifestJson = {
          icons: [
            {
              src: "images/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        }
        await fsp.writeFile(
          path.join(tempDir, "manifest.json"),
          JSON.stringify(manifestJson)
        )

        mockedUpload.mockResolvedValue({
          Key: "app_prod_test123/pwa/some-uuid.png",
        } as any)

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())
          .expect(200)

        expect(mockedUpload).toHaveBeenCalledTimes(1)
        expect(res.body.icons).toEqual([
          {
            src: "app_prod_test123/pwa/some-uuid.png",
            sizes: "192x192",
            type: "image/png",
          },
        ])
      })

      it("derives icons from a folder-based PWA asset zip", async () => {
        await fsp.mkdir(path.join(tempDir, "android"), { recursive: true })
        await fsp.mkdir(path.join(tempDir, "ios"), { recursive: true })
        await fsp.writeFile(
          path.join(tempDir, "android", "launchericon-192x192.png"),
          "fake-png-data"
        )
        await fsp.writeFile(
          path.join(tempDir, "ios", "192.png"),
          "fake-png-data"
        )

        mockedUpload
          .mockResolvedValueOnce({
            Key: "app_prod_test123/pwa/icon-192.png",
          } as any)
          .mockResolvedValueOnce({
            Key: "app_prod_test123/pwa/icon-ios-192.png",
          } as any)

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "appstore-images.zip")
          .set(config.defaultHeaders())
          .expect(200)

        expect(mockedUpload).toHaveBeenCalledTimes(2)
        expect(res.body.icons).toEqual([
          {
            src: "app_prod_test123/pwa/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "app_prod_test123/pwa/icon-ios-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ])
      })

      it("skips icons with an absolute src path outside the zip directory", async () => {
        const iconsJson = {
          icons: [
            {
              src: "/etc/passwd",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        }
        await fsp.writeFile(
          path.join(tempDir, "icons.json"),
          JSON.stringify(iconsJson)
        )

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch("No valid icons found in the zip file")
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("rejects a symlinked icons.json file", async () => {
        const sensitiveDir = path.join(tmpdir(), `sensitive-${Date.now()}`)
        await fsp.mkdir(sensitiveDir, { recursive: true })
        const sensitiveFile = path.join(sensitiveDir, "icons.json")
        await fsp.writeFile(
          sensitiveFile,
          JSON.stringify({
            icons: [
              {
                src: "icon-192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          })
        )
        await fsp.writeFile(path.join(tempDir, "icon-192.png"), "fake-png-data")
        await fsp.symlink(sensitiveFile, path.join(tempDir, "icons.json"))

        try {
          const res = await request
            .post("/api/pwa/process-zip")
            .attach("file", Buffer.from("fake-zip"), "icons.zip")
            .set(config.defaultHeaders())

          expect(res.status).toEqual(400)
          expect(res.body.message).toMatch(
            "Invalid zip structure - missing icons.json"
          )
          expect(mockedUpload).not.toHaveBeenCalled()
        } finally {
          await fsp.rm(sensitiveDir, { recursive: true, force: true })
        }
      })

      it("skips icons whose src is a symlink to a file outside the zip directory", async () => {
        const sensitiveDir = path.join(tmpdir(), `sensitive-${Date.now()}`)
        await fsp.mkdir(sensitiveDir, { recursive: true })
        const sensitiveFile = path.join(sensitiveDir, "secret.png")
        await fsp.writeFile(sensitiveFile, "sensitive-data")
        await fsp.symlink(sensitiveFile, path.join(tempDir, "evil.png"))

        try {
          const iconsJson = {
            icons: [
              {
                src: "evil.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          }
          await fsp.writeFile(
            path.join(tempDir, "icons.json"),
            JSON.stringify(iconsJson)
          )

          const res = await request
            .post("/api/pwa/process-zip")
            .attach("file", Buffer.from("fake-zip"), "icons.zip")
            .set(config.defaultHeaders())

          expect(res.status).toEqual(400)
          expect(res.body.message).toMatch(
            "No valid icons found in the zip file"
          )
          expect(mockedUpload).not.toHaveBeenCalled()
        } finally {
          await fsp.rm(sensitiveDir, { recursive: true, force: true })
        }
      })

      it("rejects a zip entry that is a symlink", async () => {
        const symlinkExternalAttr = (0o120777 << 16) >>> 0

        mockedExtract.mockImplementation(
          async (_zipPath: string, opts: any) => {
            await fsp.mkdir(opts.dir, { recursive: true })
            opts.onEntry?.(
              {
                fileName: "payload.txt",
                uncompressedSize: 10,
                externalFileAttributes: symlinkExternalAttr,
              },
              {}
            )
          }
        )

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toEqual("Invalid zip")
        expect(mockedUpload).not.toHaveBeenCalled()
      })
    })

    describe("resource limits", () => {
      const mockExtractWithEntries = (
        entries: { fileName: string; uncompressedSize: number }[]
      ) => {
        mockedExtract.mockImplementation(
          async (_zipPath: string, opts: any) => {
            await fsp.mkdir(opts.dir, { recursive: true })
            for (const entry of entries) {
              opts.onEntry?.(entry, {})
              if (!entry.fileName.endsWith("/")) {
                const dest = path.join(opts.dir, entry.fileName)
                await fsp.mkdir(path.dirname(dest), { recursive: true })
                await fsp.writeFile(dest, "x")
              }
            }
          }
        )
      }

      it("rejects a zip containing too many files", async () => {
        mockExtractWithEntries(
          Array.from({ length: 101 }, (_, i) => ({
            fileName: `icon-${i}.png`,
            uncompressedSize: 100,
          }))
        )

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch("too many files")
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("rejects a zip with a single oversized file", async () => {
        mockExtractWithEntries([
          { fileName: "icon.png", uncompressedSize: 11 * 1024 * 1024 },
        ])

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch('file "icon.png" exceeds')
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("rejects a zip whose total uncompressed size is too large", async () => {
        mockExtractWithEntries(
          Array.from({ length: 6 }, (_, i) => ({
            fileName: `icon-${i}.png`,
            uncompressedSize: 9 * 1024 * 1024,
          }))
        )

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch("uncompressed contents exceed")
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("rejects a zip that nests directories too deeply", async () => {
        mockExtractWithEntries([
          {
            fileName: "a/b/c/d/e/f/g/h/i/j/k/icon.png",
            uncompressedSize: 100,
          },
        ])

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch("directory depth exceeds")
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("does not count __MACOSX entries against the file limit", async () => {
        const entries = [
          ...Array.from({ length: 60 }, (_, i) => ({
            fileName: `__MACOSX/icon-${i}.png`,
            uncompressedSize: 100,
          })),
          { fileName: "icon-192.png", uncompressedSize: 100 },
          {
            fileName: "icons.json",
            uncompressedSize: 100,
          },
        ]
        mockedExtract.mockImplementation(
          async (_zipPath: string, opts: any) => {
            await fsp.mkdir(opts.dir, { recursive: true })
            for (const entry of entries) {
              opts.onEntry?.(entry, {})
            }
            await fsp.writeFile(
              path.join(opts.dir, "icons.json"),
              JSON.stringify({
                icons: [
                  { src: "icon-192.png", sizes: "192x192", type: "image/png" },
                ],
              })
            )
            await fsp.writeFile(
              path.join(opts.dir, "icon-192.png"),
              "fake-png-data"
            )
          }
        )
        mockedUpload.mockResolvedValue({
          Key: "app_prod_test123/pwa/some-uuid.png",
        } as any)

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())
          .expect(200)

        expect(res.body.icons).toHaveLength(1)
      })

      it("removes the temporary extraction directory once finished", async () => {
        const rmSpy = jest.spyOn(fsp, "rm")
        try {
          mockExtractWithEntries([
            { fileName: "icon.png", uncompressedSize: 11 * 1024 * 1024 },
          ])

          await request
            .post("/api/pwa/process-zip")
            .attach("file", Buffer.from("fake-zip"), "icons.zip")
            .set(config.defaultHeaders())

          const cleanedTempDir = rmSpy.mock.calls.some(
            ([target]) =>
              typeof target === "string" &&
              target.includes(`${path.sep}pwa-`) &&
              !target.includes("pwa-test-")
          )
          expect(cleanedTempDir).toBe(true)
        } finally {
          rmSpy.mockRestore()
        }
      })
    })
  })
})
