<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size = "M"
  export let serif = false
  export let weight = 400
  export let textAlign = "left"
</script>

<p
  style="font-weight:{weight};text-align:{textAlign};"
  class="spectrum-Body spectrum-Body--size{size}"
  class:spectrum-Body--serif={serif}
>
  <slot />
</p>
