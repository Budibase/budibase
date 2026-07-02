<script lang="ts">
  export let title: string | undefined = undefined
</script>

<div aria-label={title || "Drawer"}>
  <slot name="buttons" />
  <slot name="body" />
</div>
