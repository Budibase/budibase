<script>
  import { IconAvatar } from "@budibase/bbui"

  export let text = ""
  export let size = "S"
</script>

<div class="scim-banner">
  <IconAvatar
    name="Sync"
    {size}
    background={"var(--spectrum-global-color-gray-500)"}
  />
  {text}
</div>

<style>
  .scim-banner {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
