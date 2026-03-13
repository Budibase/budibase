<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    children: Snippet
    target?: string
  }

  let { children, target = ".route-header .page-actions" }: Props = $props()
  let container: HTMLElement | undefined = $state()

  $effect(() => {
    const targetEl = document.querySelector(target)

    if (targetEl && container) {
      targetEl.appendChild(container)
    }

    return () => {
      if (container?.parentNode) {
        container.parentNode.removeChild(container)
      }
    }
  })
</script>

<div bind:this={container}>
  {@render children()}
</div>
