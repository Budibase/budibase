<script>
  import { setContext, getContext } from "svelte"
  import Icon from "../Icon.svelte"
  import ripple from "../Ripple.js"
  import ClassBuilder from "../ClassBuilder.js"

  const cb = new ClassBuilder("button", ["primary", "medium"])

  export let variant = "raised"
  export let colour = "primary"
  export let size = "medium"

  export let href = ""
  export let icon = ""
  export let trailingIcon = false
  export let fullBleed = false

  export let text = ""
  export let disabled = false

  $: if (icon) {
    setContext("BBMD:icon:context", "button")
  }

  $: renderLeadingIcon = !!icon && !trailingIcon
  $: renderTrailingIcon = !!icon && trailingIcon

  let blockClasses = cb.blocks({
    modifiers: !href ? [variant] : null,
    customs: { size, colour },
  })
</script>

<!-- TODO: Activated colour on primary elevated buttons seems to be rendering weird  -->
{#if href}
  <a class={blockClasses} {href} on:click>
    <span class={cb.elements('label')}>{text}</span>
  </a>
{:else}
  <button
    use:ripple={{ colour }}
    class={blockClasses}
    class:fullBleed
    {disabled}
    on:click>
    {#if renderLeadingIcon}
      <Icon {icon} />
    {/if}
    <span class={cb.elements('label')}>{text}</span>
    {#if renderTrailingIcon}
      <Icon {icon} />
    {/if}
  </button>
{/if}

<style>
  .fullBleed {
    width: 100%;
  }
</style>
