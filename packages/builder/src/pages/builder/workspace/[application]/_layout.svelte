<script lang="ts">
  import { featureFlags } from "@/stores/portal"
  import NewLayout from "./_flagged/layout.new.svelte"
  import OldLayout from "./_flagged/layout.old.svelte"

  export let application: string

  let cachedAppId: string

  $: manageApp(application)

  const manageApp = async (application: string) => {
    if (application && cachedAppId !== application) {
      cachedAppId = application
    }
  }

  $: layout = $featureFlags.WORKSPACES ? NewLayout : OldLayout
</script>

<!-- If navigating to another app from within an app you need to rerender -->
{#key cachedAppId}
  <svelte:component this={layout} {application}>
    <slot />
  </svelte:component>
{/key}
