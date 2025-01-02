import { it, expect, describe, beforeEach, vi } from "vitest"
import { get, writable } from "svelte/store"
import { API } from "@/api"
import {
  INITIAL_NAVIGATION_STATE,
  NavigationStore,
} from "@/stores/builder/navigation"
import { appStore } from "@/stores/builder"

vi.mock("@/api", () => {
  return {
    API: {
      saveAppMetadata: vi.fn(),
    },
  }
})

vi.mock("@/stores/builder", async () => {
  const mockAppStore = writable()
  const appStore = {
    subscribe: mockAppStore.subscribe,
    update: mockAppStore.update,
    set: mockAppStore.set,
  }

  return {
    appStore,
  }
})

describe("Navigation store", () => {
  beforeEach(async ctx => {
    vi.clearAllMocks()

    const navigationStore = new NavigationStore()
    ctx.test = {
      get store() {
        return get(navigationStore)
      },
      navigationStore,
    }
  })

  it("Create base navigation store with defaults", ctx => {
    expect(ctx.test.store).toStrictEqual(INITIAL_NAVIGATION_STATE)
  })

  it("Save a new link", async ctx => {
    const links = [
      {
        url: "/home",
        text: "Home",
        type: "link",
      },
      {
        url: "/test",
        text: "Test",
        type: "sublinks",
        subLinks: [
          {
            text: "Foo",
            url: "/bar",
          },
        ],
      },
    ]

    ctx.test.navigationStore.update(state => ({
      ...state,
      links,
    }))

    const saveSpy = vi
      .spyOn(ctx.test.navigationStore, "save")
      .mockImplementation(() => {})

    await ctx.test.navigationStore.saveLink("/test-url", "Testing", "BASIC")

    expect(saveSpy).toBeCalledWith({
      ...INITIAL_NAVIGATION_STATE,
      links: [
        ...links,
        {
          url: "/test-url",
          text: "Testing",
          type: "link",
          roleId: "BASIC",
        },
      ],
    })
  })

  it("Skip save if the link already exists", async ctx => {
    ctx.test.navigationStore.update(state => ({
      ...state,
      links: [
        {
          url: "/home",
          text: "Home",
          type: "link",
        },
      ],
    }))
    const saveSpy = vi
      .spyOn(ctx.test.navigationStore, "save")
      .mockImplementation(() => {})

    await ctx.test.navigationStore.saveLink("/home", "Home", "BASIC")

    expect(saveSpy).not.toHaveBeenCalled()
  })

  it("Should delete all links matching the provided URLs string array", async ctx => {
    ctx.test.navigationStore.update(state => ({
      ...state,
      links: [
        {
          url: "/home",
          text: "Home",
          type: "link",
        },
        {
          url: "/test",
          text: "Test",
          type: "link",
        },
        {
          url: "/last",
          text: "Last Link",
          type: "sublinks",
          subLinks: [
            {
              text: "Foo",
              url: "/home",
            },
          ],
        },
      ],
    }))

    const saveSpy = vi
      .spyOn(ctx.test.navigationStore, "save")
      .mockImplementation(() => {})

    await ctx.test.navigationStore.deleteLink(["/home", "/test"])

    expect(saveSpy).toHaveBeenCalledWith({
      ...ctx.test.store,
      links: [
        {
          text: "Last Link",
          url: "/last",
          type: "sublinks",
          subLinks: [],
        },
      ],
    })
  })

  it("Should delete link with a single URL string", async ctx => {
    const links = [
      {
        url: "/home",
        text: "Home",
        type: "link",
      },
      {
        url: "/test",
        text: "Test",
        type: "link",
      },
      {
        url: "/last",
        text: "Last Link",
        type: "link",
      },
    ]

    ctx.test.navigationStore.update(state => ({
      ...state,
      links,
    }))

    const saveSpy = vi
      .spyOn(ctx.test.navigationStore, "save")
      .mockImplementation(() => {})

    await ctx.test.navigationStore.deleteLink(["/test"])

    expect(saveSpy).toHaveBeenCalledWith({
      ...ctx.test.store,
      links: [
        {
          url: "/home",
          text: "Home",
          type: "link",
        },
        {
          url: "/last",
          text: "Last Link",
          type: "link",
        },
      ],
    })
  })

  it("Should ignore a request to delete if there are no links", async ctx => {
    const saveSpy = vi.spyOn(ctx.test.navigationStore, "save")

    await ctx.test.navigationStore.deleteLink("/some-link")

    expect(saveSpy).not.toBeCalled()
  })

  it("Should save the navigation against the currently loaded builder app", async ctx => {
    // Set a fake appId to resolve
    appStore.update(state => ({
      ...state,
      appId: "testing_123",
    }))

    ctx.test.navigationStore.update(state => ({
      ...state,
      links: [
        {
          url: "/home",
          text: "Home",
          type: "link",
        },
        {
          url: "/last",
          text: "Last Link",
          type: "sublinks",
          subLinks: [
            {
              text: "Foo",
              url: "/bar",
            },
          ],
        },
      ],
    }))

    // Build the update to add 1 new link
    const update = {
      ...ctx.test.store,
      links: [
        ...ctx.test.store.links,
        {
          url: "/new-link",
          text: "New Link",
          type: "link",
        },
      ],
    }

    const saveSpy = vi.spyOn(API, "saveAppMetadata").mockImplementation(() => {
      return {
        navigation: update,
      }
    })

    expect(ctx.test.store.links.length).toBe(2)

    await ctx.test.navigationStore.save(update)

    expect(saveSpy).toHaveBeenCalledWith("testing_123", { navigation: update })

    expect(ctx.test.store.links.length).toBe(3)

    const newLink = ctx.test.store.links.find(link => link.url === "/new-link")
    expect(newLink).toBeDefined()
  })
})
