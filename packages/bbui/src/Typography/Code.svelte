<script lang="ts">
  import "@spectrum-css/typography/dist/index-vars.css"

  // Sizes
  export let size: "S" | "M" | "L" = "M"
</script>

<code class="spectrum-Code spectrum-Code--size{size}">
  <slot />
</code>
