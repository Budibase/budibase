<script>
  import PanelHeader from "./PanelHeader.svelte"
  export let onBack = () => {}
</script>

<div>
  <PanelHeader
    title="Give it some data"
    subtitle="Not ready to add yours? Get started with sample data!"
    {onBack}
  />
  <slot />
</div>
