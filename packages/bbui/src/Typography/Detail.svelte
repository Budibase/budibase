<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size = "M"
  export let serif = false
  export let weight = 600
</script>

<p
  style={`
    ${weight ? `font-weight:${weight};` : ""}
  `}
  class="spectrum-Detail spectrum-Detail--size{size}"
  class:spectrum-Detail--serif={serif}
>
  <slot />
</p>

<style>
</style>
