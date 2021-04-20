<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  // Sizes
  export let xxxl = false
  export let xxl = false
  export let xl = false
  export let l = false
  export let m = false
  export let s = false
  export let xs = false
  export let xxs = false

  $: useDefault = ![xxxl, xxl, xl, l, m, s, xs, xxs].includes(true)
</script>

<h1
  class="spectrum-Heading"
  class:spectrum-Heading--sizeXXXL={xxxl}
  class:spectrum-Heading--sizeXXL={xxl}
  class:spectrum-Heading--sizeXL={xl}
  class:spectrum-Heading--sizeL={l}
  class:spectrum-Heading--sizeM={m || useDefault}
  class:spectrum-Heading--sizeS={s}
  class:spectrum-Heading--sizeXS={xs}
  class:spectrum-Heading--sizeXXS={xxs}>
  <slot />
</h1>
