<script lang="ts">
  import "@spectrum-css/typography/dist/index-vars.css"

  // Sizes
  export let size: "XS" | "S" | "M" | "L" = "M"
  export let textAlign: string | undefined = undefined
  export let noPadding: boolean = false
  export let weight: "light" | "heavy" | "default" = "default"
</script>

<h1
  data-testid="typography-heading"
  style={textAlign ? `text-align:${textAlign}` : ``}
  class:noPadding
  class="spectrum-Heading spectrum-Heading--size{size} spectrum-Heading--{weight}"
>
  <slot />
</h1>

<style>
  h1 {
    font-family: var(--font-accent);
  }

  h1 {
    text-wrap: balance;
  }
</style>
