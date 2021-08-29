<script>
  import { admin } from "stores/portal"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"
  import LocaleSwitcher from "components/common/LocaleSwitcher.svelte"

  let loaded = false

  onMount(() => {
    if ($admin?.checklist?.adminUser) {
      $redirect("../")
    } else {
      loaded = true
    }
  })
</script>

{#if loaded}
  <LocaleSwitcher />
  <slot />
{/if}
