<script>
import { redirect } from "@roxi/routify"
import { admin } from "stores/portal"
import { onMount } from "svelte"

let loaded = false

$: cloud = $admin.cloud
$: useAccountPortal = cloud && !$admin.disableAccountPortal

onMount(() => {
  if ($admin?.checklist?.adminUser.checked || useAccountPortal) {
    $redirect("../")
  } else {
    loaded = true
  }
})
</script>

{#if loaded}
  <slot />
{/if}
