<script>
  import RelationshipField from "./RelationshipField.svelte"
</script>

<RelationshipField
  {...$$props}
  datasourceType={"user"}
  primaryDisplay={"email"}
/>
