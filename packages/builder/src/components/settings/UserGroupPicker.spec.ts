import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockLayout from "@/test/mocks/MockLayout.svelte"
import MockSearch from "@/test/mocks/MockSearch.svelte"

vi.mock("@budibase/bbui", () => ({
  Icon: MockIcon,
  Layout: MockLayout,
  ProgressCircle: MockIcon,
  Search: MockSearch,
}))

import UserGroupPicker from "./UserGroupPicker.svelte"

const buildUsers = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    _id: `user-${i}`,
    email: `user${String(i).padStart(2, "0")}@example.com`,
  }))

const setScrollMetrics = (
  element: HTMLElement,
  metrics: { scrollTop: number; scrollHeight: number; clientHeight: number }
) => {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(element, key, { configurable: true, value })
  }
}

const getItemsContainer = () =>
  screen.getByText("user00@example.com").closest(".items") as HTMLElement

describe("UserGroupPicker", () => {
  it("does not request more items when there are no more pages", () => {
    const onLoadMore = vi.fn()
    render(UserGroupPicker, {
      props: {
        labelKey: "email",
        list: buildUsers(10),
        hasMore: false,
        onLoadMore,
      },
    })

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it("does not request more items while a page is already loading", () => {
    const onLoadMore = vi.fn()
    render(UserGroupPicker, {
      props: {
        labelKey: "email",
        list: buildUsers(10),
        hasMore: true,
        loading: true,
        onLoadMore,
      },
    })

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it("requests more items when the list does not fill the scroll area", () => {
    const onLoadMore = vi.fn()
    render(UserGroupPicker, {
      props: {
        labelKey: "email",
        list: buildUsers(2),
        hasMore: true,
        onLoadMore,
      },
    })

    expect(onLoadMore).toHaveBeenCalled()
  })

  it("requests more items only once scrolled near the bottom", async () => {
    const onLoadMore = vi.fn()
    const { rerender } = render(UserGroupPicker, {
      props: {
        labelKey: "email",
        list: buildUsers(10),
        hasMore: false,
        onLoadMore,
      },
    })
    const items = getItemsContainer()
    setScrollMetrics(items, {
      scrollTop: 0,
      scrollHeight: 400,
      clientHeight: 242,
    })
    await rerender({ hasMore: true })

    await fireEvent.scroll(items)
    expect(onLoadMore).not.toHaveBeenCalled()

    setScrollMetrics(items, {
      scrollTop: 150,
      scrollHeight: 400,
      clientHeight: 242,
    })
    await fireEvent.scroll(items)
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })
})
