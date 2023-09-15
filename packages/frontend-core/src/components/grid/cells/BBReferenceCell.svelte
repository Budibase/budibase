<script>
  import { getContext } from "svelte"
  import RelationshipCell from "./RelationshipCell.svelte"
  import { FieldSubtype } from "@budibase/types"

  const { API } = getContext("grid")
  const { subtype } = $$props.schema

  const schema = {
    ...$$props.schema,
    tableId: "external",
  }

  async function searchFunction(searchParams) {
    if (subtype !== FieldSubtype.USER) {
      throw `Search for '${subtype}' not implemented`
    }

    const results = await API.searchUsers({
      ...searchParams,
    })
    return {
      ...results,
      data: undefined,
      rows: results.data,
    }
  }
</script>

<RelationshipCell
  {...$$props}
  {schema}
  {searchFunction}
  primaryDisplay={"email"}
  relationshipType={"many-to-one"}
/>
