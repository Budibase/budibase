<script>
  import { getContext } from "svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  $: styles = {
    id: $component.styles.id,
    allowSelection: $component.styles.allowSelection,
  }
</script>

{#if $builderStore.inBuilder}
  <div use:styleable={styles}>
    <slot />
  </div>
{/if}
