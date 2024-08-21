<script>
  import { onMount } from "svelte"

  export let heading = ""
  let body

  const handleScroll = e => {
    if (!body) return

    body.scrollTo({ top: body.scrollTop + e.deltaY, behavior: "smooth" })
  }

  onMount(() => {
    window.addEventListener("wheel", handleScroll)

    return () => {
      window.removeEventListener("wheel", handleScroll)
    }
  })
</script>

<div class="heading">
  <span class="heading">
    <slot name="heading">
      {heading}
    </slot>
  </span>
</div>
<div class="divider" />
<div bind:this={body} class="body">
  <slot />
</div>

<style>
  .heading {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .divider {
    border-bottom: 1px solid var(--grey-4);
    margin: 12px 0 12px;
  }

  .body {
    max-height: 300px;
    overflow-y: auto;
  }
</style>
