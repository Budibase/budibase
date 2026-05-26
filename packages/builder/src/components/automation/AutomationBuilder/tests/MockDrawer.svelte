<script lang="ts">
  export let title = ""

  let visible = false

  export const show = () => {
    visible = true
  }

  export const hide = () => {
    visible = false
  }
</script>

{#if visible}
  <section aria-label={title}>
    <slot name="buttons" />
    <slot name="body" />
  </section>
{/if}
