<script>
  import { getContext } from "svelte"

  const { linkable, styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let url
  export let text
  export let openInNewTab
  export let color
  export let align
  export let bold
  export let italic
  export let underline
  export let size

  $: external = url && !url.startsWith("/")
  $: target = openInNewTab ? "_blank" : "_self"
  $: placeholder = $builderStore.inBuilder && !text
  $: componentText = $builderStore.inBuilder
    ? text || "Placeholder link"
    : text || ""

  // Add color styles to main styles object, otherwise the styleable helper
  // overrides the color when it's passed as inline style.
  // Add color styles to main styles object, otherwise the styleable helper
  // overrides the color when it's passed as inline style.
  $: styles = enrichStyles($component.styles, color)

  const enrichStyles = (styles, color) => {
    if (!color) {
      return styles
    }
    return {
      ...styles,
      normal: {
        ...styles?.normal,
        color,
      },
    }
  }
</script>

{#if $builderStore.inBuilder || componentText}
  {#if external}
    <a
      {target}
      href={url || "/"}
      use:styleable={styles}
      class:placeholder
      class:bold
      class:italic
      class:underline
      class="align--{align || 'left'} size--{size || 'M'}"
    >
      {componentText}
    </a>
  {:else}
    <a
      use:linkable
      href={url || "/"}
      use:styleable={styles}
      class:placeholder
      class:bold
      class:italic
      class:underline
      class="align--{align || 'left'} size--{size || 'M'}"
    >
      {componentText}
    </a>
  {/if}
{/if}

<style>
  a {
    color: var(--spectrum-alias-text-color);
    white-space: nowrap;
    transition: color 130ms ease-in-out;
  }
  a:hover {
    color: var(--spectrum-global-color-blue-600) !important;
  }
  .placeholder {
    font-style: italic;
    color: var(--spectrum-global-color-gray-600);
  }
  .bold {
    font-weight: 600;
  }
  .italic {
    font-style: italic;
  }
  .underline {
    text-decoration: underline;
  }
  .size--S {
    font-size: 14px;
  }
  .size--M {
    font-size: 16px;
  }
  .size--L {
    font-size: 18px;
  }
  .align--left {
    text-align: left;
  }
  .align--center {
    text-align: center;
  }
  .align--right {
    text-align: right;
  }
  .align-justify {
    text-align: justify;
  }
</style>
