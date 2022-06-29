<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size = "M"
  export let serif = false
</script>

<p
  class="spectrum-Detail spectrum-Detail--size{size}"
  class:spectrum-Detail--serif={serif}
>
  <slot />
</p>

<style>
  p {
    font-weight: 600;
  }
</style>
