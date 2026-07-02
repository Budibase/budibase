import Koa from "koa"
import jwt, { Secret } from "jsonwebtoken"
import { constants, env as coreEnv, utils } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { BuilderSocketEvent } from "@budibase/shared-core"
import TestConfiguration from "../tests/utilities/TestConfiguration"
import BuilderSocket from "./builder"

describe("BuilderSocket - SelectApp authorization", () => {
  const config = new TestConfiguration()

  let workspaceAProdId: string
  let workspaceADevId: string
  let workspaceBDevId: string
  let authCookie: string

  beforeAll(async () => {
    await config.newTenant()
    workspaceAProdId = config.getProdWorkspaceId()
    workspaceADevId = config.getDevWorkspaceId()

    await config.createWorkspace("Workspace B")
    workspaceBDevId = config.getDevWorkspaceId()

    // A user who is a builder of Workspace A only - not a global builder,
    // and with no permissions at all on Workspace B.
    const scopedUserId = `us_${generator.guid()}`
    await config.globalUser({
      _id: scopedUserId,
      builder: { global: false, apps: [workspaceAProdId] },
    })

    const authToken = jwt.sign(
      {
        userId: scopedUserId,
        sessionId: config.sessionIdForUser(scopedUserId),
        tenantId: config.getTenantId(),
      },
      coreEnv.JWT_SECRET as Secret,
      { expiresIn: utils.getSessionExpirySeconds() }
    )
    authCookie = `${constants.Cookie.Auth}=${authToken}`
  })

  afterAll(() => {
    config.end()
  })

  function createFakeSocket() {
    const handlers: Record<string, (...args: any[]) => any> = {}
    const fakeSocket: any = {
      request: {
        headers: { cookie: authCookie },
        url: "/",
        method: "GET",
        socket: { remoteAddress: "127.0.0.1" },
        httpVersion: "1.1",
      },
      data: {},
      disconnect: jest.fn(),
      on: (event: string, handler: (...args: any[]) => any) => {
        handlers[event] = handler
      },
    }
    return { fakeSocket, handlers }
  }

  it("does not let a builder of one workspace join another workspace's room via SelectApp", async () => {
    // Instantiated without going through `new BuilderSocket(app, server)` -
    // that constructor stands up a real socket.io server + Redis adapter,
    // which isn't supported in this test environment. We only need the
    // `onConnect` handler under test, so we bind it to a bare instance.
    const socketInstance = Object.create(BuilderSocket.prototype) as any
    socketInstance.app = new Koa()
    socketInstance.joinRoom = jest.fn()
    socketInstance.getRoomSessions = jest.fn().mockResolvedValue([])

    const { fakeSocket, handlers } = createFakeSocket()
    await socketInstance.onConnect(fakeSocket)

    const callback = jest.fn()
    await handlers[BuilderSocketEvent.SelectApp](
      { appId: workspaceBDevId },
      callback
    )

    // The connecting user is only a builder of Workspace A. They must not
    // be able to join Workspace B's room just by sending its id.
    expect(socketInstance.joinRoom).not.toHaveBeenCalled()
    expect(fakeSocket.disconnect).toHaveBeenCalledWith(true)
  })

  it("lets a builder join their own workspace's room via SelectApp", async () => {
    const socketInstance = Object.create(BuilderSocket.prototype) as any
    socketInstance.app = new Koa()
    socketInstance.joinRoom = jest.fn()
    socketInstance.getRoomSessions = jest.fn().mockResolvedValue([])

    const { fakeSocket, handlers } = createFakeSocket()
    await socketInstance.onConnect(fakeSocket)

    const callback = jest.fn()
    await handlers[BuilderSocketEvent.SelectApp](
      { appId: workspaceADevId },
      callback
    )

    expect(socketInstance.joinRoom).toHaveBeenCalledWith(
      fakeSocket,
      workspaceADevId
    )
    expect(fakeSocket.disconnect).not.toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith({ users: [] })
  })
})
