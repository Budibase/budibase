<script lang="ts">
  import { featureFlags } from "@/stores/portal"
  import NewLayout from "./_flagged/layout.new.svelte"
  import OldLayout from "./_flagged/layout.old.svelte"

  export let application: string

  $: layout = $featureFlags.WORKSPACES ? NewLayout : OldLayout
</script>

<svelte:component this={layout} {application}>
  <slot />
</svelte:component>
