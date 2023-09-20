<script>
  import RelationshipField from "./RelationshipField.svelte"

  const schema = {
    ...$$props.schema,
    // This is not really used, just adding some content to be able to render the relationship cell
    tableId: "external",
  }
</script>

<RelationshipField {...$$props} {schema} datasourceType={"user"} />
