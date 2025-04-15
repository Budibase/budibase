<script lang="ts">
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size: "S" | "M" | "L" = "M"
  export let serif: boolean = false
  export let weight: number | null = null
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
