<script>
  import { setContext, getContext } from "svelte";
  import Icon from "../Icon.svelte";
  import ripple from "../Ripple.js";
  import ClassBuilder from "../ClassBuilder.js";

  const cb = new ClassBuilder("button", ["primary", "medium"]);

  export let variant = "raised";
  export let colour = "primary";
  export let size = "medium";

  export let href = "";
  export let icon = "";
  export let trailingIcon = false;
  export let fullwidth = false;

  export let text = "";
  export let disabled = false;

  let modifiers = {};
  let customs = { size, colour };

  if (!href) modifiers = { variant };

  let props = { modifiers, customs };

  let blockClasses = cb.build({ props });
  const labelClass = cb.elem("label");

  $: if (icon) {
    setContext("BBMD:icon:context", "button");
  }

  $: renderLeadingIcon = !!icon && !trailingIcon;
  $: renderTrailingIcon = !!icon && trailingIcon;
</script>

<style>
  .fullwidth {
    width: 100%;
  }
</style>

{#if href}
  <a class={blockClasses} {href} on:click>
    <span class={labelClass}>{text}</span>
  </a>
{:else}
  <button
    use:ripple={{ colour }}
    class={blockClasses}
    class:fullwidth
    {disabled}
    on:click>
    {#if renderLeadingIcon}
      <Icon {icon} />
    {/if}
    <span class={labelClass}>{text}</span>
    {#if renderTrailingIcon}
      <Icon {icon} />
    {/if}
  </button>
{/if}
