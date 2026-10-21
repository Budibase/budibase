import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockLayout from "@/test/mocks/MockLayout.svelte"
import MockSearch from "@/test/mocks/MockSearch.svelte"

vi.mock("@budibase/bbui", () => ({
  ActionButton: MockButton,
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

const getLabels = () =>
  Array.from(document.querySelectorAll(".item .text")).map(el =>
    el.textContent?.trim()
  )

const outOfOrderUsers = [
  { _id: "user-1", email: "carol@example.com" },
  { _id: "user-2", email: "alice@example.com" },
  { _id: "user-3", email: "bob@example.com" },
]

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

  it("sorts selected items first, then by label, by default", () => {
    render(UserGroupPicker, {
      props: {
        labelKey: "email",
        list: outOfOrderUsers,
        selected: ["user-1"],
      },
    })

    expect(getLabels()).toEqual([
      "carol@example.com",
      "alice@example.com",
      "bob@example.com",
    ])
  })

  it("keeps the given order when preserveOrder is set", async () => {
    const { rerender } = render(UserGroupPicker, {
      props: {
        labelKey: "email",
        list: outOfOrderUsers,
        selected: [],
        preserveOrder: true,
      },
    })
    const fetchedOrder = outOfOrderUsers.map(user => user.email)
    expect(getLabels()).toEqual(fetchedOrder)

    await rerender({ selected: ["user-3"] })
    expect(getLabels()).toEqual(fetchedOrder)
  })

  it("shows a retry action instead of loading more after a failure", async () => {
    const onLoadMore = vi.fn()
    const onRetry = vi.fn()
    render(UserGroupPicker, {
      props: {
        labelKey: "email",
        list: buildUsers(2),
        hasMore: false,
        loadFailed: true,
        onLoadMore,
        onRetry,
      },
    })

    expect(onLoadMore).not.toHaveBeenCalled()
    await fireEvent.click(screen.getByText("Retry"))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
