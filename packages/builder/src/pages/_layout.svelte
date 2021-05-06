<script>
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { auth } from "stores/backend"
  import { admin } from "stores/portal"

  let checked = false

  onMount(async () => {
    await admin.init()
    if (!$admin?.checklist?.adminUser) {
      $goto("./admin")
    } else {
      await auth.checkAuth()
      checked = true
    }
  })

  $: {
    if (checked && !$auth.user) {
      $goto("./auth/login")
    }
  }
</script>

{#if $admin.checklist}
  <slot />
{/if}
