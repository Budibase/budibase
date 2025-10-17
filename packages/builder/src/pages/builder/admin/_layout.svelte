<script>
  import { admin } from "@/stores/portal"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $redirect

  let loaded = false

  $: cloud = $admin.cloud
  $: useAccountPortal = cloud && !$admin.disableAccountPortal

  onMount(() => {
    if ($admin?.checklist?.adminUser?.checked || useAccountPortal) {
      $redirect("../")
    } else {
      loaded = true
    }
  })
</script>

{#if loaded}
  <slot />
{/if}
