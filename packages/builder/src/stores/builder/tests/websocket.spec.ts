import { beforeEach, describe, expect, it, vi } from "vitest"
import type { UIUser } from "@budibase/types"
import { BuilderSocketEvent } from "@budibase/shared-core"
import { createBuilderWebsocket } from "../websocket"
import { onWorkspaceReady } from "../workspaceReady"

const mocks = vi.hoisted(() => ({
  socket: {
    on: vi.fn<(event: string, callback: () => void) => void>(),
    onOther: vi.fn(),
    emit: vi.fn<
      (
        event: string,
        payload: { appId: string },
        callback: (response: { users: UIUser[] }) => void
      ) => void
    >(),
  },
  initUsers: vi.fn(),
}))

vi.mock("@budibase/frontend-core", () => ({
  createWebsocket: () => mocks.socket,
}))
vi.mock("@/stores/builder", () => ({
  userStore: { init: mocks.initUsers },
}))
vi.mock("@/stores/portal", () => ({}))
vi.mock("../screens", () => ({}))
vi.mock("@budibase/bbui", () => ({}))

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
