<script>
  import { getContext } from "svelte"
  import RelationshipCell from "./RelationshipCell.svelte"
  import { FieldSubtype, RelationshipType } from "@budibase/types"

  export let api

  const { API } = getContext("grid")
  const { subtype } = $$props.schema

  const schema = {
    ...$$props.schema,
    // This is not really used, just adding some content to be able to render the relationship cell
    tableId: "external",
    relationshipType:
      subtype === FieldSubtype.USER
        ? RelationshipType.ONE_TO_MANY
        : RelationshipType.MANY_TO_MANY,
  }

  async function searchFunction(searchParams) {
    if (subtype !== FieldSubtype.USER && subtype !== FieldSubtype.USERS) {
      throw `Search for '${subtype}' not implemented`
    }

    // As we are overriding the search function from RelationshipCell, we want to map one shape to the expected one for the specific API
    const email = Object.values(searchParams.query.string)[0]

    const results = await API.searchUsers({
      query: { string: { email } },
    })

    // Mapping to the expected data within RelationshipCell
    return {
      ...results,
      data: undefined,
      rows: results.data,
    }
  }
</script>

<RelationshipCell
  bind:api
  {...$$props}
  {schema}
  {searchFunction}
  primaryDisplay={"email"}
/>
