<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let url
</script>

{#if url}
  <img src={url} alt={$component.name} use:styleable={$component.styles} />
{:else}
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
    height: 75px;
    width: 150px;
  }
</style>
