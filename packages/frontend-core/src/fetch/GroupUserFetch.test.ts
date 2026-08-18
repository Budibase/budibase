// @vitest-environment jsdom

import { get } from "svelte/store"
import { describe, expect, it, vi } from "vitest"
import type { SearchUserGroupResponse } from "@budibase/types"
import { createAPIClient } from "../api"
import type { APIClient } from "../api/types"
import GroupUserFetch from "./GroupUserFetch"

describe("GroupUserFetch", () => {
  it("ignores an older initial load that finishes after a newer one", async () => {
    let resolveFirst = (_response: SearchUserGroupResponse) => {}
    let resolveSecond = (_response: SearchUserGroupResponse) => {}
    const firstResponse = new Promise<SearchUserGroupResponse>(resolve => {
      resolveFirst = resolve
    })
    const secondResponse = new Promise<SearchUserGroupResponse>(resolve => {
      resolveSecond = resolve
    })
    const getGroupUsers = vi
      .fn<APIClient["getGroupUsers"]>()
      .mockReturnValueOnce(firstResponse)
      .mockReturnValueOnce(secondResponse)
    const API = createAPIClient()
    API.getGroupUsers = getGroupUsers
    const fetch = new GroupUserFetch({
      API,
      datasource: { type: "groupUser" },
      query: { groupId: "group_1", emailSearch: "first" },
    })

    const firstLoad = fetch.getInitialData()
    await vi.waitFor(() => expect(getGroupUsers).toHaveBeenCalledTimes(1))
    const secondLoad = fetch.update({
      query: { groupId: "group_1", emailSearch: "second" },
    })
    await vi.waitFor(() => expect(getGroupUsers).toHaveBeenCalledTimes(2))

    resolveSecond({
      users: [{ _id: "user_2", email: "second@example.com" }],
      bookmark: "",
    })
    await secondLoad
    resolveFirst({
      users: [{ _id: "user_1", email: "first@example.com" }],
      bookmark: "",
    })
    await firstLoad

    expect(get(fetch).rows).toEqual([
      { _id: "user_2", email: "second@example.com" },
    ])
  })
})
