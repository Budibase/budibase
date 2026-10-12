<script lang="ts">
  export let breadcrumbs: { text: string }[] = []
</script>

<div data-testid="function-name">
  {breadcrumbs[breadcrumbs.length - 1]?.text}
</div>
