jest.mock("@chat-adapter/teams", () => ({
  cardToAdaptiveCard: jest.fn(() => adaptiveSourceCard),
}))

import nock from "nock"
import { Actions, Card, LinkButton } from "chat"
import { cardToAdaptiveCard } from "@chat-adapter/teams"
import { AgentChannelProvider, type Agent } from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { DEFAULT_MSTEAMS_SERVICE_URL } from "../../utilities/msTeams"
import { replyToConversation } from "./ms-teams"

const adaptiveSourceCard = {
  type: "AdaptiveCard",
  version: "1.4",
  body: [{ type: "TextBlock", text: "Sources" }],
  actions: [
    {
      type: "Action.OpenUrl",
      title: "Policy.pdf",
      url: "https://example.com/signed/policy.pdf",
    },
  ],
}

describe("Teams queued reply delivery", () => {
  const config = new TestConfiguration()
  const serviceUrl = new URL("/emea/", DEFAULT_MSTEAMS_SERVICE_URL)
  const activityPath = "/emea/v3/conversations/conversation_1/activities"
  const sourceCard = Card({
    title: "Sources",
    children: [
      Actions([
        LinkButton({
          label: "Policy.pdf",
          url: "https://example.com/signed/policy.pdf",
        }),
      ]),
    ],
  })
  let agent: Agent
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>

  const reply = (includeSources = true) =>
    config.doInContext(config.getDevWorkspaceId(), () =>
      replyToConversation({
        appId: config.getDevWorkspaceId(),
        agentId: agent._id,
        channel: {
          provider: AgentChannelProvider.MSTEAMS,
          conversationType: "personal",
          conversationId: "conversation_1",
          serviceUrl: serviceUrl.toString(),
        },
        text: "Answer with sources",
        sourceCard: includeSources ? sourceCard : undefined,
      })
    )

  beforeEach(async () => {
    await config.newTenant()
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation()
    agent = await config.api.agent.create({
      name: "Teams Agent",
      MSTeamsIntegration: {
        appId: "11111111-1111-4111-8111-111111111111",
        appPassword: "teams-app-password",
        tenantId: "teams-tenant",
      },
    })
    nock("https://login.microsoftonline.com")
      .post("/teams-tenant/oauth2/v2.0/token")
      .reply(200, { access_token: "teams-token", expires_in: 3600 })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    config.end()
  })

  it("sends the answer followed by an Adaptive Card to the conversation service URL", async () => {
    const requests = nock(serviceUrl.origin, {
      reqheaders: { authorization: "Bearer teams-token" },
    })
      .post(activityPath, { type: "message", text: "Answer with sources" })
      .reply(200, { id: "answer_1" })
      .post(activityPath, {
        type: "message",
        attachments: [
          {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: adaptiveSourceCard,
          },
        ],
      })
      .reply(200, { id: "sources_1" })

    await reply()

    expect(requests.isDone()).toBe(true)
    expect(cardToAdaptiveCard).toHaveBeenCalledWith(sourceCard)
  })

  it("sends only the text when there is no Sources card", async () => {
    const requests = nock(serviceUrl.origin)
      .post(activityPath, { type: "message", text: "Answer with sources" })
      .reply(200, { id: "answer_1" })

    await reply(false)

    expect(requests.isDone()).toBe(true)
    expect(cardToAdaptiveCard).not.toHaveBeenCalled()
  })

  it("does not fail the answer when the Sources card cannot be sent", async () => {
    const requests = nock(serviceUrl.origin)
      .post(activityPath, { type: "message", text: "Answer with sources" })
      .reply(200, { id: "answer_1" })
      .post(activityPath)
      .reply(503, "Teams unavailable")

    await expect(reply()).resolves.toBeUndefined()

    expect(requests.isDone()).toBe(true)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to post Teams RAG source links",
      expect.any(Error)
    )
  })

  it("propagates text delivery failures without sending the Sources card", async () => {
    const requests = nock(serviceUrl.origin)
      .post(activityPath, { type: "message", text: "Answer with sources" })
      .reply(503, "Teams unavailable")

    await expect(reply()).rejects.toThrow("Teams Bot API 503")

    expect(requests.isDone()).toBe(true)
    expect(cardToAdaptiveCard).not.toHaveBeenCalled()
  })
})
