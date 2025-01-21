<script>
  import { getContext } from "svelte"
  import { helpers } from "@budibase/shared-core"
  import RelationshipCell from "./RelationshipCell.svelte"
  import {
    BBReferenceFieldSubType,
    FieldType,
    RelationshipType,
  } from "@budibase/types"

  export let api
  export let hideCounter = false
  export let schema

  const { API } = getContext("grid")
  const { type, subtype } = schema

  $: schema = {
    ...$$props.schema,
    // This is not really used, just adding some content to be able to render the relationship cell
    tableId: "external",
    relationshipType:
      type === FieldType.BB_REFERENCE_SINGLE ||
      helpers.schema.isDeprecatedSingleUserColumn(schema)
        ? RelationshipType.ONE_TO_MANY
        : RelationshipType.MANY_TO_MANY,
  }

  async function searchFunction(_tableId, searchParams) {
    if (
      subtype !== BBReferenceFieldSubType.USER &&
      subtype !== BBReferenceFieldSubType.USERS
    ) {
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
  {...$$restProps}
  {schema}
  {searchFunction}
  primaryDisplay={"email"}
  {hideCounter}
/>
