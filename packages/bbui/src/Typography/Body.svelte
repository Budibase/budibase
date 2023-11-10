<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size = "M"
  export let serif = false
  export let weight = null
  export let textAlign = null
  export let color = null
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
