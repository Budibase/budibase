<script>
  import { slide } from "svelte/transition"
  import Portal from "svelte-portal"
  import Button from "../Button/Button.svelte"
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
          <Body size="S">
            <slot name="description" />
          </Body>
        </div>
        <div class="buttons">
          <Button secondary quiet on:click={hide}>Cancel</Button>
          <slot name="buttons" />
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
    border-top: var(--border-light);
    z-index: 2;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: var(--border-light);
    padding: var(--spacing-l) var(--spacing-xl);
    gap: var(--spacing-xl);
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
</style>
