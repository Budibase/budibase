import { context, docIds } from "@budibase/backend-core"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  LiteLLMKeyConfig,
} from "@budibase/types"
import TestConfiguration from "./TestConfiguration"

export async function setupDefaultCompletionsAIConfig(
  config: TestConfiguration
): Promise<() => Promise<void>> {
  const created: { workspaceId: string; id: string; rev: string }[] = []

  const configId = docIds.generateAIConfigID()
  await config.withApp(config.getDevWorkspaceId(), async () => {
    const db = context.getWorkspaceDB()
    const workspaceId = config.getDevWorkspaceId()

    const keyDocId = docIds.getLiteLLMKeyID()
    const existing = await db.tryGet<LiteLLMKeyConfig>(keyDocId)
    if (!existing) {
      const { id, rev } = await db.put({
        _id: keyDocId,
        keyId: `test-key-${workspaceId}`,
        secretKey: "sk-test-key",
        teamId: `test-team-${workspaceId}`,
      })

      created.push({ workspaceId, id, rev })
    }

    const aiConfig = await db.put({
      _id: configId,
      name: "Default BBAI",
      provider: BUDIBASE_AI_PROVIDER_ID,
      credentialsFields: {},
      model: "budibase/v1",
      liteLLMModelId: BUDIBASE_AI_PROVIDER_ID,
      configType: AIConfigType.COMPLETIONS,
      isDefault: true,
    })
    created.push({ workspaceId, id: aiConfig.id, rev: aiConfig.rev })
  })

  return async () => {
    for (const entry of created) {
      await config.withApp(entry.workspaceId, async () => {
        const db = context.getWorkspaceDB()
        await db.remove(entry.id, entry.rev)
      })
    }
  }
}
