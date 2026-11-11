import { beforeEach, describe, expect, it, vi } from "vitest"
import type { UIUser } from "@budibase/types"
import { BuilderSocketEvent } from "@budibase/shared-core"
import { createBuilderWebsocket } from "../websocket"
import { onWorkspaceReady } from "../workspaceReady"

const mocks = vi.hoisted(() => ({
  socket: {
    connected: true,
    on: vi.fn<(event: string, callback: () => void) => void>(),
    onOther:
      vi.fn<
        (
          event: string,
          callback: (data: {
            user: UIUser
            published: boolean
          }) => Promise<void>
        ) => void
      >(),
    emit: vi.fn<
      (
        event: string,
        payload: { appId: string },
        callback: (response: { users: UIUser[] }) => void
      ) => void
    >(),
  },
  initUsers: vi.fn(),
  loadWorkspaces: vi.fn<() => Promise<void>>(),
  loadDeployments: vi.fn(),
  fetchPublishStatus: vi.fn(),
  notifySuccess: vi.fn(),
}))

const builder = vi.hoisted(() => {
  const store: { websocket?: object } = {}
  return store
})

vi.mock("@budibase/frontend-core", () => ({
  createWebsocket: () => mocks.socket,
}))
vi.mock("@/stores/builder", () => ({
  builderStore: builder,
  userStore: { init: mocks.initUsers },
  deploymentStore: { load: mocks.loadDeployments },
  workspaceDeploymentStore: { fetch: mocks.fetchPublishStatus },
}))
vi.mock("@/stores/portal", () => ({
  workspacesStore: { load: mocks.loadWorkspaces },
}))
vi.mock("../screens", () => ({}))
vi.mock("@budibase/bbui", () => ({
  notifications: { success: mocks.notifySuccess },
}))

describe("builder publication events", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.socket.connected = true
    builder.websocket = mocks.socket
    mocks.loadWorkspaces.mockResolvedValue()
  })

  const publish = () => {
    createBuilderWebsocket("app_test")
    const handler = mocks.socket.onOther.mock.calls.find(
      ([event]) => event === BuilderSocketEvent.AppPublishChange
    )![1]
    return handler({
      user: { email: "builder@example.com" } as UIUser,
      published: true,
    })
  }

  it("refreshes deployments when the builder is still connected", async () => {
    await publish()

    expect(mocks.loadDeployments).toHaveBeenCalledOnce()
    expect(mocks.fetchPublishStatus).toHaveBeenCalledOnce()
    expect(mocks.notifySuccess).toHaveBeenCalledOnce()
  })

  it("does not refresh deployments after leaving the builder during a publication event", async () => {
    let finishLoading = () => {}
    mocks.loadWorkspaces.mockReturnValue(
      new Promise<void>(resolve => {
        finishLoading = resolve
      })
    )
    const pending = publish()
    mocks.socket.connected = false
    builder.websocket = undefined
    finishLoading()
    await pending

    expect(mocks.loadDeployments).not.toHaveBeenCalled()
    expect(mocks.fetchPublishStatus).not.toHaveBeenCalled()
    expect(mocks.notifySuccess).not.toHaveBeenCalled()
  })

  it("refreshes deployments during a temporary disconnection while the builder remains active", async () => {
    let finishLoading = () => {}
    mocks.loadWorkspaces.mockReturnValue(
      new Promise<void>(resolve => {
        finishLoading = resolve
      })
    )
    const pending = publish()
    mocks.socket.connected = false
    finishLoading()
    await pending

    expect(mocks.loadDeployments).toHaveBeenCalledOnce()
    expect(mocks.fetchPublishStatus).toHaveBeenCalledOnce()
    expect(mocks.notifySuccess).toHaveBeenCalledOnce()
  })

  it("ignores a pending publication from a replaced builder socket", async () => {
    let finishLoading = () => {}
    mocks.loadWorkspaces.mockReturnValue(
      new Promise<void>(resolve => {
        finishLoading = resolve
      })
    )
    const pending = publish()
    builder.websocket = {}
    finishLoading()
    await pending

    expect(mocks.loadDeployments).not.toHaveBeenCalled()
    expect(mocks.fetchPublishStatus).not.toHaveBeenCalled()
    expect(mocks.notifySuccess).not.toHaveBeenCalled()
  })
})

describe("builder workspace readiness", () => {
  beforeEach(() => vi.clearAllMocks())

  it("waits for SelectApp acknowledgement on each connection", () => {
    const socket = createBuilderWebsocket("app_test")
    const ready = vi.fn()
    const unsubscribe = onWorkspaceReady({ socket, callback: ready })
    const connect = mocks.socket.on.mock.calls.find(
      ([event]) => event === "connect"
    )![1]
    try {
      connect()
      const callsBeforeAcknowledgement = ready.mock.calls.length
      mocks.socket.emit.mock.calls[0][2]({ users: [] })
      connect()
      const callsBeforeReconnectionAcknowledgement = ready.mock.calls.length
      mocks.socket.emit.mock.calls[1][2]({ users: [] })

      expect(callsBeforeAcknowledgement).toBe(0)
      expect(callsBeforeReconnectionAcknowledgement).toBe(1)
      expect(ready).toHaveBeenCalledTimes(2)
      expect(mocks.initUsers).toHaveBeenCalledTimes(2)
      expect(mocks.socket.emit).toHaveBeenCalledWith(
        BuilderSocketEvent.SelectApp,
        { appId: "app_test" },
        expect.any(Function)
      )
    } finally {
      unsubscribe()
    }
  })

  it("stops notifying unsubscribed listeners", () => {
    const socket = createBuilderWebsocket("app_test")
    const ready = vi.fn()
    const unsubscribe = onWorkspaceReady({ socket, callback: ready })
    const connect = mocks.socket.on.mock.calls.find(
      ([event]) => event === "connect"
    )![1]
    connect()
    unsubscribe()
    mocks.socket.emit.mock.calls[0][2]({ users: [] })
    expect(ready).not.toHaveBeenCalled()
  })
})
