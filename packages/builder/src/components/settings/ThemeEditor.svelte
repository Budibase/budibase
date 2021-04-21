<script>
  import { themeStore } from "builderStore"
  import { Toggle } from "@budibase/bbui"

  let showAdvanced = false
</script>

<div class="content">
  <div>
    <Toggle text="Dark theme" bind:value={$themeStore.darkMode} />
  </div>
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }
</style>
