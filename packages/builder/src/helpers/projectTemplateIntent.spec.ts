import { afterEach, describe, expect, it, vi } from "vitest"
import { auth } from "@/stores/portal/auth"

vi.mock("@/stores/portal/auth", () => ({ auth: { setInitInfo: vi.fn() } }))
vi.mock("@budibase/bbui", () => ({ notifications: { error: vi.fn() } }))
import {
  initialiseBuilderWithTemplateIntent,
  readProjectTemplateUrlIntent,
  removeProjectTemplateFromUrl,
} from "./projectTemplateIntent"

describe("Project template URL intents", () => {
  it("reads an allow-listed Project template key", () => {
    expect(
      readProjectTemplateUrlIntent(
        "?template=project%2Fexpense-approval&utm_source=website"
      )
    ).toEqual({
      present: true,
      intent: {
        templateKey: "project/expense-approval",
      },
    })
  })

  it.each([
    "?template=https%3A%2F%2Fexample.com%2Ftemplate.tar.gz",
    "?template=../project/expense-approval",
    "?template=app/expense-approval",
    "?template=project/ExpenseApproval",
    "?template=",
    `?template=project/${"a".repeat(193)}`,
  ])("rejects an invalid or legacy template key: %s", search => {
    expect(readProjectTemplateUrlIntent(search)).toEqual({
      present: true,
    })
  })

  it("distinguishes a URL without a template intent", () => {
    expect(readProjectTemplateUrlIntent("?utm_source=website")).toEqual({
      present: false,
    })
  })

  it("removes only the consumed template parameter", () => {
    expect(
      removeProjectTemplateFromUrl({
        pathname: "/builder",
        search: "?template=project%2Fexpense-approval&utm_source=website",
      })
    ).toBe("/builder?utm_source=website")
  })
})

describe("builder initialization with a template link", () => {
  afterEach(() => {
    vi.resetAllMocks()
    window.history.replaceState({}, "", "/")
  })

  it("keeps a failed pre-login save recoverable and resumes login on retry", async () => {
    window.history.replaceState(
      {},
      "",
      "/builder?template=project%2Fsupport&utm_source=website"
    )
    const initialise = vi.fn(async () => {
      window.history.replaceState({}, "", "/builder/auth/login")
    })
    vi.mocked(auth.setInitInfo)
      .mockRejectedValueOnce(new Error("unavailable"))
      .mockResolvedValueOnce({
        projectTemplate: { templateKey: "project/support" },
      })

    await expect(
      initialiseBuilderWithTemplateIntent({ initialise })
    ).rejects.toThrow("Unable to preserve the Project template link")
    expect(window.location.search).toBe(
      "?template=project%2Fsupport&utm_source=website"
    )
    expect(initialise).not.toHaveBeenCalled()

    await initialiseBuilderWithTemplateIntent({ initialise })

    expect(auth.setInitInfo).toHaveBeenLastCalledWith({
      projectTemplate: { templateKey: "project/support" },
    })
    expect(window.location.pathname).toBe("/builder/auth/login")
    expect(initialise).toHaveBeenCalledOnce()
  })
})
