<script>
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { auth } from "stores/backend"
  import { admin } from "stores/portal"

  let checked = false

  onMount(async () => {
    await admin.init()
    await auth.checkAuth()
    if (!$admin?.checklist?.adminUser) {
      $goto("./admin")
    }
    checked = true
  })

  $: {
    if (checked && !$auth.user) {
      $goto("./auth/login")
    }
  }
</script>

{#if checked}
  <slot />
{/if}
