<script>
  import { Icon } from "@budibase/bbui"
  import { organisation } from "stores/portal"
  import { onMount } from "svelte"

  onMount(async () => {
    if (!$organisation.logoUrl) {
      await organisation.init()
    }
  })
</script>

<a
  target="_blank"
  href={$organisation.helpUrl ||
    "https://github.com/Budibase/budibase/discussions"}
>
  <Icon hoverable name="Help" size="XXL" />
</a>

<style>
  a {
    color: inherit;
    position: absolute;
    bottom: var(--spacing-m);
    right: var(--spacing-m);
    border-radius: 55%;
  }
</style>
