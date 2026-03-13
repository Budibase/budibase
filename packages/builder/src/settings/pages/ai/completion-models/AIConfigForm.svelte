<script lang="ts">
  import { AIConfigType } from "@budibase/types"
  import AIConfigEditor from "../AIConfigEditor.svelte"

  export interface Props {
    configId?: string
    provider?: string | undefined
  }

  let { configId, provider }: Props = $props()
</script>

<AIConfigEditor
  {configId}
  {provider}
  configType={AIConfigType.COMPLETIONS}
  showReasoningEffort
  setDefaultOnFirstCreate
  useRouteProviderOnEdit
/>
