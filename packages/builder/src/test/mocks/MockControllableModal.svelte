<script lang="ts">
  let open = false

  export const show = () => {
    open = true
  }

  export const hide = () => {
    open = false
  }
</script>

{#if open}
  <div data-testid="mock-modal">
    <slot />
  </div>
{/if}
