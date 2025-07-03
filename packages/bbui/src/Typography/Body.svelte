<script lang="ts">
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size: "XS" | "S" | "M" | "L" | "XL" = "M"
  export let serif: boolean = false
  export let weight: string | null = null
  export let textAlign: string | null = null
  export let color: string | null = null
</script>

<p
  data-testid="typography-body"
  style={`
    ${weight ? `font-weight:${weight};` : ""}
    ${textAlign ? `text-align:${textAlign};` : ""}
    ${color ? `color:${color};` : ""}
  `}
  class="spectrum-Body spectrum-Body--size{size}"
  class:spectrum-Body--serif={serif}
>
  <slot />
</p>

<style>
  p {
    text-wrap: pretty;
    letter-spacing: -0.01em !important;
    text-rendering: optimizelegibility;
  }
</style>
