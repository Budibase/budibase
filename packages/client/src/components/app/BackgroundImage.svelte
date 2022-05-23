<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let url
  export let position

  let style = ""
  $: {
    if (url) {
      style += `background-image: url("${url}");`
    }
    if (position) {
      style += `background-position: ${position};`
    }
  }
</script>

{#if url}
  <div class="outer" use:styleable={$component.styles}>
    <div class="inner" {style} />
  </div>
{:else if $builderStore.inBuilder}
  <div
    class="placeholder"
    use:styleable={{ ...$component.styles, empty: true }}
  >
    <Placeholder>
      <div slot="content">
        Add the <mark>URL</mark> and start updating your background image&nbsp;
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
  .outer {
    position: relative;
    width: 100%;
    height: 400px;
  }

  .inner {
    position: absolute;
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .placeholder {
    display: grid;
    place-items: center;
  }
</style>
