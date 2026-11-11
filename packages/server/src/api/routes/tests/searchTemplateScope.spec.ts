import { roles } from "@budibase/backend-core"
import { PermissionLevel } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

describe("row search query bindings", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => config.end())

  it("does not evaluate JavaScript supplied by a table reader", async () => {
    const table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, { name: "template-target" })
    await config.api.permission.add({
      roleId: roles.BUILTIN_ROLE_IDS.BASIC,
      resourceId: table._id!,
      level: PermissionLevel.READ,
    })
    await config.publish()

    const script = Buffer.from('return "template-target"').toString("base64")
    await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
      await config.api.row.search(
        table._id!,
        { query: { equal: { name: `{{ js "${script}" }}` } } },
        { status: 400 }
      )
      await config.api.row.search(
        table._id!,
        { query: { equal: { name: "{{ user.oauth2.accessToken }}" } } },
        { status: 400 }
      )
      await config.api.row.search(
        table._id!,
        { query: { equal: { name: "{{ [user].[oauth2].[accessToken] }}" } } },
        { status: 400 }
      )
      const result = await config.api.row.search(table._id!, {
        query: { equal: { name: "template-target" } },
      })
      expect(result.rows).toHaveLength(1)
    })
  })

  it.each([
    { binding: "{{ user.globalId }}", property: "_id" },
    { binding: "{{ [user].globalId }}", property: "_id" },
    { binding: "{{ [user].[globalId] }}", property: "_id" },
    { binding: "{{ user.[globalId] }}", property: "_id" },
    { binding: "{{ [user].[firstName] }}", property: "firstName" },
  ] as const)(
    "resolves reader identity binding $binding",
    async ({ binding, property }) => {
      const table = await config.api.table.save(basicTable())
      await config.api.permission.add({
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        resourceId: table._id!,
        level: PermissionLevel.READ,
      })
      await config.api.permission.add({
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        resourceId: table._id!,
        level: PermissionLevel.WRITE,
      })
      await config.publish()

      await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
        const user = await config.globalUser(config.getUser())
        const name = user[property]
        const row = await config.api.row.save(table._id!, { name })
        const plain = await config.api.row.search(table._id!, {
          query: { equal: { name } },
        })
        expect(plain.rows.map(found => found._id)).toEqual([row._id])
        const result = await config.api.row.search(table._id!, {
          query: { equal: { name: binding } },
        })
        expect(result.rows.map(found => found._id)).toEqual([row._id])
      })
    }
  )
})
