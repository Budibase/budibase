<script lang="ts">
  import { ActionButton, ActionMenu, MenuSection } from "@budibase/bbui"

  export let authConfigId: string
  export let authConfigs: { label: string; value: string }[]

  $: authConfig = authConfigs.find(c => c.value === authConfigId)
</script>

<ActionMenu align="right">
  <div slot="control">
    <ActionButton icon="LockClosed" quiet selected>
      {#if !authConfig}
        Authentication
      {:else}
        Auth: {authConfig.label}
      {/if}
    </ActionButton>
  </div>
</ActionMenu>
