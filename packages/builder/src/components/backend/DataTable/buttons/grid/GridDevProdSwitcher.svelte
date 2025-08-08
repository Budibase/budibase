<script lang="ts">
  import { Switcher } from "@budibase/bbui"
  import { dataEnvironmentStore } from "@/stores/builder"
  import { DataEnvironmentMode } from "@budibase/types"

  export let visible: boolean = true

  $: isDevMode = $dataEnvironmentStore.mode === DataEnvironmentMode.DEVELOPMENT
</script>

{#if visible}
  <Switcher
    leftIcon="wrench"
    leftText="Dev"
    rightIcon="rocket"
    rightText="Prod"
    selected={isDevMode ? "left" : "right"}
    on:left={() =>
      dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)}
    on:right={() =>
      dataEnvironmentStore.setMode(DataEnvironmentMode.PRODUCTION)}
  />
{/if}
