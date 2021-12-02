<script>
  import { Body } from "@budibase/bbui"
  import { RawRestBodyTypes } from "constants"

  export let query
  export let bodyType
</script>

{#if bodyType === RawRestBodyTypes.NONE}
  <Body>The request does not have a body</Body>
{:else if bodyType === RawRestBodyTypes.FORM}
  <Body>Form</Body>
{/if}
