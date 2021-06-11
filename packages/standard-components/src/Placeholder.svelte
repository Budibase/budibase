<script>
  import { getContext } from "svelte"

  const { builderStore } = getContext("sdk")
  const component = getContext("component")

  export let text = $component.name || "Placeholder"
</script>

{#if $builderStore.inBuilder}
  <div>
    {text}
  </div>
{/if}

<style>
  div {
    padding: 20px;
    color: #888;
  }
</style>
