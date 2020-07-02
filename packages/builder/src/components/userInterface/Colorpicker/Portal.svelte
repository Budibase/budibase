<script>
  import { onMount } from "svelte"

  export let target = document.body

  let targetEl
  let portal
  let componentInstance

  onMount(() => {
    if (typeof target === "string") {
      targetEl = document.querySelector(target)
      // Force exit
      if (targetEl === null) {
        return () => {}
      }
    } else if (target instanceof HTMLElement) {
      targetEl = target
    } else {
      throw new TypeError(
        `Unknown target type: ${typeof target}. Allowed types: String (CSS selector), HTMLElement.`
      )
    }

    portal = document.createElement("div")
    targetEl.appendChild(portal)
    portal.appendChild(componentInstance)

    return () => {
      targetEl.removeChild(portal)
    }
  })
</script>

<div bind:this={componentInstance}>
  <slot />
</div>
