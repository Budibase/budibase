import { context } from "@budibase/backend-core"
import {
  Document,
  DocumentType,
  EscalationAction,
  EscalationContextDoc,
  EscalationNotificationDoc,
  EscalationSource,
  SEPARATOR,
} from "@budibase/types"
import { escalationProcessor } from "../../../escalation/processor"
import { getQueue } from "../../../escalation/queue"
import sdk from "../../../sdk"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

jest.mock("../../../sdk/workspace/escalations", () => ({
  ...jest.requireActual("../../../sdk/workspace/escalations"),
}))

describe("/api/escalations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  const seedPending = async ({
    escalationId,
    appId = config.getDevWorkspaceId(),
  }: {
    escalationId: string
    appId?: string
  }) => {
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await context.getWorkspaceDB().put({
        _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`,
        source: EscalationSource.OPERATION,
        appId,
        tenantId: config.getTenantId(),
        durationMs: 0,
        resolution: "pending",
      })
    })
  }

  const getDoc = (escalationId: string) =>
    config.doInContext(config.getDevWorkspaceId(), async () => {
      const doc = await sdk.escalations.getContextDoc(escalationId)
      return doc as EscalationContextDoc
    })

  describe("resolve", () => {
    it("records a response on a pending escalation", async () => {
      const escalationId = "esc-resolve-pending"
      await seedPending({ escalationId })

      const result = await config.api.escalation.resolve(escalationId, {
        accepted: true,
        actionId: EscalationAction.APPROVE,
      })

      expect(result.status).toEqual("recorded")
      expect((await getDoc(escalationId)).resolution).toEqual("resolved")
    })

    it("reports closed when the escalation closes while waiting for the lock", async () => {
      const escalationId = "esc-resolve-race"
      await seedPending({ escalationId })

      let releaseLock: () => void = () => {}
      let lockAcquired: () => void = () => {}
      const held = new Promise<void>(resolve => (releaseLock = resolve))
      const acquired = new Promise<void>(resolve => (lockAcquired = resolve))
      const holding = config.doInContext(config.getDevWorkspaceId(), () =>
        sdk.escalations.withEscalationLock(escalationId, () => {
          lockAcquired()
          return held
        })
      )
      await acquired

      let requestReachedLock: () => void = () => {}
      const reachedLock = new Promise<void>(
        resolve => (requestReachedLock = resolve)
      )
      const withLock = sdk.escalations.withEscalationLock
      const lockSpy = jest
        .spyOn(sdk.escalations, "withEscalationLock")
        .mockImplementationOnce((id, task) => {
          requestReachedLock()
          return withLock(id, task)
        })
      const request = config.api.escalation.resolve(escalationId, {
        accepted: true,
        actionId: EscalationAction.APPROVE,
      })
      try {
        await reachedLock
        await config.doInContext(config.getDevWorkspaceId(), () =>
          escalationProcessor.cancel(escalationId)
        )
      } finally {
        releaseLock()
        lockSpy.mockRestore()
      }
      await holding

      const result = await request
      expect(result.status).toEqual("closed")
      expect((await getDoc(escalationId)).resolution).toEqual("cancelled")
    })
  })

  // e.g. a prod escalation copied into dev by an old sync - it keeps prod's
  // appId, so acting on it would resume or cancel the prod original
  describe("copies of another workspace's escalation", () => {
    const seedCopy = (escalationId: string) =>
      seedPending({ escalationId, appId: config.getProdWorkspaceId() })

    const getRawDoc = <T extends Document>(id: string) =>
      config.doInContext(config.getDevWorkspaceId(), () =>
        context.getWorkspaceDB().tryGet<T>(id)
      )
    const getRawContextDoc = (escalationId: string) =>
      getRawDoc<EscalationContextDoc>(
        `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`
      )

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it("does not resolve a copy", async () => {
      const escalationId = "esc-copy-resolve"
      await seedCopy(escalationId)
      const addJob = jest.spyOn(getQueue(), "add")

      await config.api.escalation.resolve(
        escalationId,
        { accepted: true, actionId: EscalationAction.APPROVE },
        { status: 404 }
      )

      expect(addJob).not.toHaveBeenCalled()
      expect(await getRawContextDoc(escalationId)).toHaveProperty(
        "resolution",
        "pending"
      )
    })

    it("does not cancel a copy", async () => {
      const escalationId = "esc-copy-cancel"
      await seedCopy(escalationId)

      await config.api.escalation.cancel(escalationId)

      expect(await getRawContextDoc(escalationId)).toHaveProperty(
        "resolution",
        "pending"
      )
    })

    it("does not record a response on a copy", async () => {
      const escalationId = "esc-copy-respond"
      const notificationId = `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}esc-copy-respond`
      await seedCopy(escalationId)
      await config.doInContext(config.getDevWorkspaceId(), () =>
        context.getWorkspaceDB().put({
          _id: notificationId,
          escalationId,
          appId: config.getProdWorkspaceId(),
          tenantId: config.getTenantId(),
          status: "sent",
        })
      )

      await expect(
        config.doInContext(config.getDevWorkspaceId(), () =>
          sdk.escalations.respond(
            escalationId,
            notificationId,
            { accepted: true, actionId: EscalationAction.APPROVE },
            jest.fn()
          )
        )
      ).rejects.toThrow(`Escalation ${escalationId} not found`)

      expect(
        await getRawDoc<EscalationNotificationDoc>(notificationId)
      ).not.toHaveProperty("responses")
    })
  })
})
