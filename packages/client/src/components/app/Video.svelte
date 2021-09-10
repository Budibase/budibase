<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let url
  export let autoplay
</script>

{#if url}
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    src={url}
    {autoplay}
    alt={$component.name}
    use:styleable={$component.styles}
    controls
  />
{:else if $builderStore.inBuilder}
  <div
    class="placeholder"
    use:styleable={{ ...$component.styles, empty: true }}
  >
    <Placeholder />
  </div>
{/if}

<style>
  .placeholder {
    display: grid;
    place-items: center;
  }
</style>
