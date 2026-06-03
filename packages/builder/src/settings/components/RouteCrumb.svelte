<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    children: Snippet
    target?: string
  }

  let { children, target = ".route-header .last-crumb-content" }: Props =
    $props()
  let container: HTMLElement | undefined = $state()

  $effect(() => {
    const targetEl = document.querySelector(target)
    if (!targetEl || !container) return

    targetEl.replaceChildren(container)

    return () => {
      if (container?.parentNode) {
        container.parentNode.removeChild(container)
      }
    }
  })
</script>

<div bind:this={container} class="route-crumb">
  {@render children()}
</div>

<style>
  .route-crumb {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
</style>
