<script>
  import TagsTableRenderer from "./TagsTableRenderer.svelte"
  export let value

  $: roles = value?.filter(role => role != null).map(role => role.name) ?? []
</script>

<TagsTableRenderer value={roles} />
