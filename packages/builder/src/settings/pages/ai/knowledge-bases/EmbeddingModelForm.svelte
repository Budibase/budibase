<script lang="ts">
  import { knowledgeBaseStore } from "@/stores/portal"
  import { AIConfigType } from "@budibase/types"
  import AIConfigEditor from "../AIConfigEditor.svelte"
  import { onMount } from "svelte"
  import { notifications } from "@budibase/bbui"

  export interface Props {
    configId?: string
    provider?: string | undefined
  }

  let { configId, provider }: Props = $props()

  let referencingKnowledgeBaseCount = $derived.by(() => {
    if (!configId || configId === "new") {
      return 0
    }

    return $knowledgeBaseStore.list.filter(
      knowledgeBase => knowledgeBase.embeddingModel === configId
    ).length
  })

  let deleteBlockedMessage = $derived.by(() =>
    referencingKnowledgeBaseCount > 0
      ? `This embedding model can't be deleted because it's used by ${referencingKnowledgeBaseCount} knowledge base${referencingKnowledgeBaseCount === 1 ? "" : "s"}.`
      : undefined
  )

  const handleCreate = ({ _id }: { _id?: string }) => {
    const formDraft = knowledgeBaseStore.getFormDraft()
    if (formDraft && _id) {
      knowledgeBaseStore.setFormDraft({
        ...formDraft,
        embeddingModel: _id,
      })
    }
  }

  onMount(async () => {
    try {
      await knowledgeBaseStore.fetch()
    } catch (err: any) {
      notifications.error(err.message || "Failed to load knowledge bases")
    }
  })
</script>

<AIConfigEditor
  {configId}
  {provider}
  configType={AIConfigType.EMBEDDINGS}
  disableProviderOnEdit
  onCreate={handleCreate}
  {deleteBlockedMessage}
/>
