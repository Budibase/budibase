<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size = "M"
  export let serif = false
  export let weight = null
  export let textAlign = null
</script>

<p
  style={`
    ${weight ? `font-weight:${weight};` : ""}
    ${textAlign ? `text-align:${textAlign};` : ""}
  `}
  class:noPadding
  class="spectrum-Body spectrum-Body--size{size}"
  class:spectrum-Body--serif={serif}
>
  <slot />
</p>
