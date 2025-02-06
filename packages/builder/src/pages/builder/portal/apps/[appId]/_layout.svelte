<script>
  import { params, redirect } from "@roxi/routify"
  import { appsStore } from "@/stores/portal"

  $: app = $appsStore.apps.find(app => app.appId === $params.appId)
  $: {
    if (!app) {
      $redirect("../")
    }
  }
</script>

{#if app}
  <slot />
{/if}
