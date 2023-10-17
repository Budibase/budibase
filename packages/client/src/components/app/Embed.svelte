<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let embed
</script>

{#if embed}
  <div class="embed" use:styleable={$component.styles}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html embed}
  </div>
{:else if $builderStore.inBuilder}
  <div use:styleable={{ ...$component.styles, empty: true }}>
    <Placeholder />
  </div>
{/if}

<style>
  .embed {
    position: relative;
  }
  .embed :global(> *) {
    width: 100%;
    height: 100%;
  }
</style>
