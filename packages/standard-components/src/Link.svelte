<script>
  import { getContext } from "svelte"

  const { linkable, styleable } = getContext("sdk")
  const component = getContext("component")

  export let url = ""
  export let text = ""
  export let openInNewTab = false
  export let external = false

  $: target = openInNewTab ? "_blank" : "_self"
</script>

{#if external}
  <a href={url || '/'} {target} use:styleable={$component.styles}>
    {text}
    <slot />
  </a>
{:else}
  <a href={url || '/'} use:linkable {target} use:styleable={$component.styles}>
    {text}
    <slot />
  </a>
{/if}
