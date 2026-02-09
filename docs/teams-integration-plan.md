# MS Teams Integration Plan (Based on Current Discord Branch Architecture)

## Summary
- Reuse the same architecture implemented in this branch for Discord: agent-level integration config, explicit sync endpoint, public webhook route, chatApp enablement, channel-scoped conversation reuse, and async invocation into `agentChatComplete`.
- Implement Teams using Bot Framework SDK adapter handling in `packages/server`, with per-agent bot credentials and support for personal, team, and group chat scopes.
- Preserve `/ask` and `/new` semantics; in Teams these are driven by command-menu text insertion and message parsing, not dynamic slash-command registration.

## Discord Work Completed on This Branch

### Core server implementation
- Deployment helper and integration utilities:
  - `packages/server/src/sdk/workspace/ai/deployments/discord.ts`
  - Includes config validation, chatApp resolution/enabling, webhook URL builder, invite URL builder, command sync, and signature/timestamp verification helpers.
- Agent controller sync flow:
  - `packages/server/src/api/controllers/ai/agents.ts`
  - Adds `syncAgentDiscordCommands`, validates integration, resolves chat app, syncs commands, and persists `chatAppId` + `interactionsEndpointUrl`.
- Public webhook routing and controller:
  - `packages/server/src/api/routes/webhook.ts`
  - `packages/server/src/api/controllers/webhook.ts`
  - `packages/server/src/api/controllers/webhook/discord.ts`
  - Handles signature validation, ping, deferred response, background processing, conversation resolution, and follow-up responses.
- Route registration:
  - `packages/server/src/api/routes/ai.ts`
  - Adds `POST /api/agent/:agentId/discord/sync`.

### Conversation model and runtime plumbing
- Conversation channel metadata support:
  - `packages/types/src/documents/global/chat.ts`
  - `packages/server/src/api/controllers/ai/chatConversations.ts`
- Koa parser bypass for Discord webhook raw body:
  - `packages/server/src/koa.ts`
- Webhook endpoint classification update:
  - `packages/server/src/middleware/utils.ts`

### Type and shared surface
- Agent integration type additions:
  - `packages/types/src/documents/global/agents.ts`
- API request/response types:
  - `packages/types/src/api/web/global/agents.ts`
- Deployment channel SDK types:
  - `packages/types/src/sdk/channelDeployments/discord.ts`
  - `packages/types/src/sdk/channelDeployments/index.ts`
  - `packages/types/src/sdk/index.ts`
- Shared constants:
  - `packages/shared-core/src/constants/discord.ts`
  - `packages/shared-core/src/constants/index.ts`

### Frontend and builder wiring
- API client and store updates:
  - `packages/frontend-core/src/api/agents.ts`
  - `packages/builder/src/stores/portal/agents.ts`
- Deployment UI:
  - `packages/builder/src/pages/builder/workspace/[application]/agent/[agentId]/deployment.svelte`
  - `packages/builder/src/pages/builder/workspace/[application]/agent/[agentId]/DeploymentChannels/DiscordConfig.svelte`

### Test coverage added
- API route/integration tests:
  - `packages/server/src/api/routes/tests/ai/agentDiscord.spec.ts`
- Webhook helper tests:
  - `packages/server/src/api/controllers/webhook/discord.spec.ts`

## MS Teams Integration Plan

## Decisions (Locked)
- Runtime/auth path: Bot Framework SDK adapter handling (not custom JWT auth implementation).
- Scope for v1: personal + team + group chat.
- Tenant model: multi-tenant first, with optional config for tenant constraints.
- Identity model: one Teams app registration per agent (Discord-like isolation).
- Command UX: text commands with command-menu entries (`ask`, `new`).

## 1) Data Model and Types
- Add `TeamsAgentIntegration` in `packages/types/src/documents/global/agents.ts`:
  - `appId?: string`
  - `appPassword?: string`
  - `tenantId?: string`
  - `chatAppId?: string`
  - `messagingEndpointUrl?: string`
  - `idleTimeoutMinutes?: number`
- Extend `Agent` with `teamsIntegration?: TeamsAgentIntegration`.
- Add Teams sync API types in `packages/types/src/api/web/global/agents.ts`:
  - `SyncAgentTeamsRequest { chatAppId?: string }`
  - `SyncAgentTeamsResponse { success: true; chatAppId: string; messagingEndpointUrl: string }`
- Add Teams channel deployment types in:
  - `packages/types/src/sdk/channelDeployments/teams.ts`
  - export via `packages/types/src/sdk/channelDeployments/index.ts`

## 2) Validation and CRUD Wiring
- Extend Joi validator in `packages/server/src/api/routes/utils/validators/agent.ts` with `teamsIntegration`.
- Pass through `teamsIntegration` on create/update:
  - `packages/server/src/api/controllers/ai/agents.ts`
  - `packages/server/src/sdk/workspace/ai/agents/crud.ts`

## 3) Teams Deployment Helpers
- Add `packages/server/src/sdk/workspace/ai/deployments/teams.ts`:
  - `validateTeamsIntegration(agent)`
  - `resolveChatAppForAgent(agentId, chatAppId?)` (same behavior as Discord helper)
  - `buildTeamsWebhookUrl(chatAppId, agentId)` producing:
    - `/api/webhooks/teams/:instance/:chatAppId/:agentId`
- Export from:
  - `packages/server/src/sdk/workspace/ai/deployments/index.ts`
  - `packages/server/src/sdk/workspace/ai/index.ts`

## 4) Teams Sync Endpoint
- Add route in `packages/server/src/api/routes/ai.ts`:
  - `POST /api/agent/:agentId/teams/sync`
- Add controller in `packages/server/src/api/controllers/ai/agents.ts`:
  - Validate Teams config.
  - Resolve/enable chat app association.
  - Build and persist `messagingEndpointUrl` and `chatAppId` into `teamsIntegration`.
  - Return `SyncAgentTeamsResponse`.
- Note: no dynamic command registration call for Teams; command menu is manifest-based.

## 5) Teams Webhook Controller
- Add public route in `packages/server/src/api/routes/webhook.ts`:
  - `POST /api/webhooks/teams/:instance/:chatAppId/:agentId`
- Export handler from `packages/server/src/api/controllers/webhook.ts`.
- Implement `packages/server/src/api/controllers/webhook/teams.ts`:
  - Accept inbound Teams activities.
  - Authenticate and process via Bot Framework adapter path.
  - Resolve prod workspace from `instance`.
  - Resolve `chatAppId` and `agentId` from route params.
  - For message activities:
    - Parse `ask <message>` and `new [message]`.
    - Build `ChatConversationChannel` with `provider: "msteams"` plus conversation identifiers.
    - Reuse or create conversations using same lifecycle used in Discord.
    - Invoke `agentChatComplete` and send reply via activity response.
  - For unsupported activity types:
    - Return safe no-op or short informational response.

## 6) Conversation Scoping for Teams
- Add Teams-specific scope matcher and picker analogous to Discord:
  - Scope key includes:
    - `chatAppId`
    - `agentId`
    - `conversation.id`
    - `channelData.channel.id` (when present)
    - `from.aadObjectId` fallback `from.id`
- Reuse idle timeout pattern:
  - `teamsIntegration.idleTimeoutMinutes` overrides default.
- Preserve provider-specific user identity namespace:
  - e.g. `msteams:${externalUserId}`

## 7) Koa and Middleware Plumbing
- Update `packages/server/src/koa.ts` to bypass default body parser for `/api/webhooks/teams/` similarly to Discord webhook path handling.
- Update `packages/server/src/middleware/utils.ts` endpoint regex to include `webhooks/teams`.

## 8) Builder UI and Frontend API
- Extend frontend API client:
  - `packages/frontend-core/src/api/agents.ts` with `syncAgentTeams`.
- Extend builder store:
  - `packages/builder/src/stores/portal/agents.ts` with `syncTeamsCommands` (or `syncTeamsChannel`).
- Add Teams deployment config UI:
  - New Teams modal/component analogous to Discord config.
  - Inputs: App ID, App Password, optional Tenant ID, Idle timeout.
  - Display generated messaging endpoint URL after sync.
  - Include install/manifest guidance for command menu entries (`ask`, `new`) and supported scopes.

## 9) Test Plan

### Unit tests
- `teams` deployment helper validation:
  - missing required fields -> 400
  - chat app resolution logic mirrors Discord behavior
  - endpoint URL generation correctness

### Controller/route tests
- `POST /api/agent/:agentId/teams/sync`:
  - success flow persists endpoint + chatAppId
  - validation failure cases

### Webhook tests
- Teams message parsing:
  - `ask message` -> continued conversation
  - `new` -> resets scope/starts new thread
  - unsupported text/activity -> safe response
- Scope matching and idle timeout behavior.
- Error handling fallback response path.

### Regression checks
- Existing Discord tests remain green.
- Existing generic webhook behavior unaffected.

## 10) Rollout and Backward Compatibility
- Entirely additive change:
  - new `teamsIntegration` field
  - new Teams sync route
  - new Teams webhook route
- No migration required for existing agents.
- Discord path remains unchanged.

## Important Risks and Mitigations
- Teams auth complexity:
  - Mitigate by using adapter path and integration tests with mocked auth boundaries.
- Mention/noise in team channels:
  - Mitigate by requiring command-text prefix and optional mention checks in team scope.
- Conversation lookup performance:
  - Reuse in-memory cache approach from Discord and keep scope-specific keys.

## External Docs Verified (for current guidance)
- Bot auth and security:
  - https://learn.microsoft.com/en-us/azure/bot-service/bot-builder-security?view=azure-bot-service-4.0
- Teams bot command menu:
  - https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/create-a-bot-commands-menu
- Teams app manifest schema:
  - https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema
- Channel/group chat bot behavior:
  - https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/conversations/channel-and-group-conversations
- Teams bot endpoint reference in current migration guidance:
  - https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/agents-sdk-migration-steps
