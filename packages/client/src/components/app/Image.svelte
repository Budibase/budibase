<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let url
</script>

{#if url}
  <img src={url} alt={$component.name} use:styleable={$component.styles} />
{:else if $builderStore.inBuilder}
  <div
    class="placeholder"
    use:styleable={{ ...$component.styles, empty: true }}
  >
    <Placeholder>
      <div slot="content">
        Add the <mark>URL</mark> and start updating your image&nbsp;
        <span
          class="showMe spectrum-Link"
          on:click={() => {
            builderStore.actions.setFocus({
              location: "component_settings",
              key: "url",
              target: $component.id,
            })
          }}
        >
          Show me
        </span>
      </div>
    </Placeholder>
  </div>
{/if}

<style>
  .placeholder {
    display: grid;
    place-items: center;
  }
</style>
