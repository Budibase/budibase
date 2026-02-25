jest.mock("@budibase/pro", () => ({
  db: {
    groups: {
      getGroupUsers: jest.fn(),
    },
  },
  groups: {},
  users: {},
  csv: {},
}))

import { db } from "@budibase/pro"
import { searchUsers } from "../groups"

const createCtx = (pageSize: string): Parameters<typeof searchUsers>[0] =>
  ({
    request: {
      query: {
        pageSize,
      },
    },
    params: {
      groupId: "group_1",
    },
    body: undefined,
  }) as unknown as Parameters<typeof searchUsers>[0]

describe("Global groups controller", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("coerces pageSize query param to a number before computing limit", async () => {
    const getGroupUsers = db.groups.getGroupUsers as jest.Mock
    getGroupUsers.mockResolvedValue(
      Array.from({ length: 6 }).map((_, i) => ({
        _id: `user_${i}`,
        email: `user_${i}@example.com`,
      }))
    )

    const ctx = createCtx("5")

    await searchUsers(ctx)

    expect(getGroupUsers).toHaveBeenCalledWith("group_1", {
      limit: 6,
      emailSearch: undefined,
      bookmark: undefined,
    })
    expect(ctx.body).toEqual({
      users: [
        { _id: "user_0", email: "user_0@example.com" },
        { _id: "user_1", email: "user_1@example.com" },
        { _id: "user_2", email: "user_2@example.com" },
        { _id: "user_3", email: "user_3@example.com" },
        { _id: "user_4", email: "user_4@example.com" },
      ],
      bookmark: "user_5",
      hasNextPage: true,
    })
  })

  it("falls back to the default page size for invalid query values", async () => {
    const getGroupUsers = db.groups.getGroupUsers as jest.Mock
    getGroupUsers.mockResolvedValue(
      Array.from({ length: 11 }).map((_, i) => ({
        _id: `user_${i}`,
        email: `user_${i}@example.com`,
      }))
    )

    const ctx = createCtx("not-a-number")

    await searchUsers(ctx)

    expect(getGroupUsers).toHaveBeenCalledWith("group_1", {
      limit: 11,
      emailSearch: undefined,
      bookmark: undefined,
    })
    expect(ctx.body.users).toHaveLength(10)
  })
})
