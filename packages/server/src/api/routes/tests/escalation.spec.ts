import { context } from "@budibase/backend-core"
import {
  DocumentType,
  EscalationAction,
  EscalationContextDoc,
  EscalationSource,
  SEPARATOR,
} from "@budibase/types"
import { escalationProcessor } from "../../../escalation/processor"
import sdk from "../../../sdk"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("/api/escalations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  const seedPending = async (escalationId: string) => {
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await context.getWorkspaceDB().put({
        _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`,
        source: EscalationSource.OPERATION,
        appId: config.getDevWorkspaceId(),
        tenantId: config.getTenantId(),
        delay: 0,
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
      await seedPending(escalationId)

      const result = await config.api.escalation.resolve(escalationId, {
        accepted: true,
        actionId: EscalationAction.APPROVE,
      })

      expect(result.status).toEqual("recorded")
      expect((await getDoc(escalationId)).resolution).toEqual("resolved")
    })

    it("reports closed when the escalation closes while waiting for the lock", async () => {
      const escalationId = "esc-resolve-race"
      await seedPending(escalationId)

      let releaseLock: () => void = () => {}
      const held = new Promise<void>(resolve => (releaseLock = resolve))
      const holding = config.doInContext(config.getDevWorkspaceId(), () =>
        sdk.escalations.withEscalationLock(escalationId, () => held)
      )

      const request = config.api.escalation.resolve(escalationId, {
        accepted: true,
        actionId: EscalationAction.APPROVE,
      })
      // Let the request reach the lock before the escalation is closed
      await new Promise(resolve => setTimeout(resolve, 300))
      await config.doInContext(config.getDevWorkspaceId(), () =>
        escalationProcessor.cancel(escalationId)
      )
      releaseLock()
      await holding

      const result = await request
      expect(result.status).toEqual("closed")
      expect((await getDoc(escalationId)).resolution).toEqual("cancelled")
    })
  })
})
