<script>
  import { params, redirect } from "@roxi/routify"
  import { apps } from "stores/portal"

  $: app = $apps.find(app => app.appId === $params.appId)
  $: {
    if (!app) {
      $redirect("../")
    }
  }
</script>

{#if app}
  <slot />
{/if}
