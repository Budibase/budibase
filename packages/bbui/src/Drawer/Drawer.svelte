<script>
  import { slide } from "svelte/transition"
  import Portal from "svelte-portal"
  import ActionButton from "../ActionButton/ActionButton.svelte"
  import Body from "../Typography/Body.svelte"
  import Heading from "../Typography/Heading.svelte"

  export let title

  let visible = false

  export function show() {
    if (visible) {
      return
    }
    visible = true
  }

  export function hide() {
    if (!visible) {
      return
    }
    visible = false
  }

  function handleKey(e) {
    if (visible && e.key === "Escape") {
      hide()
    }
  }
</script>

<svelte:window on:keydown={handleKey} />

{#if visible}
  <Portal>
    <section class="drawer" transition:slide>
      <header>
        <div class="text">
          <Heading size="XS">{title}</Heading>
          <Body size="XXS">
            <slot name="description" />
          </Body>
        </div>
        <div class="buttons">
          <slot name="buttons" />
          <ActionButton quiet icon="Close" on:click={hide} />
        </div>
      </header>
      <slot name="body" />
    </section>
  </Portal>
{/if}

<style>
  .drawer {
    position: absolute;
    bottom: 0;
    left: 260px;
    width: calc(100% - 520px);
    background: var(--background);
    border: var(--border-light);
    z-index: 2;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: var(--border-light);
    padding: var(--spectrum-alias-item-padding-s) 0;
  }
  header :global(*) + :global(*) {
    margin: 0 var(--spectrum-alias-grid-baseline);
  }

  .text {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: var(--spectrum-alias-item-padding-s);
  }
</style>
