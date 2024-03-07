<script>
  import { IconAvatar } from "@budibase/bbui"

  export let text = ""
  export let iconSize = "S"
</script>

<div class="scim-banner">
  <IconAvatar
    icon="Sync"
    size={iconSize}
    background={"var(--spectrum-global-color-gray-500)"}
    tooltip="Synced from your AD"
  />
  {text}
</div>

<style>
  .scim-banner {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
