<script>
  import { getContext } from "svelte"
  import RelationshipCell from "./RelationshipCell.svelte"
  import {
    BBReferenceFieldSubType,
    FieldType,
    RelationshipType,
  } from "@budibase/types"

  export let api
  export let hideCounter = false

  const { API } = getContext("grid")
  const { type, subtype, constraints } = $$props.schema

  let relationshipType

  $: {
    if (type === FieldType.BB_REFERENCE_SINGLE) {
      relationshipType = RelationshipType.ONE_TO_MANY
    } else if (constraints?.type === "array") {
      relationshipType = RelationshipType.MANY_TO_MANY
    } else {
      relationshipType = RelationshipType.ONE_TO_MANY
    }
  }

  $: schema = {
    ...$$props.schema,
    // This is not really used, just adding some content to be able to render the relationship cell
    tableId: "external",
    relationshipType,
  }

  async function searchFunction(searchParams) {
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
  {...$$props}
  {schema}
  {searchFunction}
  primaryDisplay={"email"}
  {hideCounter}
/>
