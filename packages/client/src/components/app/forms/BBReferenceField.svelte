<script>
  import RelationshipField from "./RelationshipField.svelte"
  import { sdk } from "@budibase/shared-core"
</script>

<RelationshipField
  {...$$props}
  datasourceType={"user"}
  primaryDisplay={"email"}
  valueConversion={value => {
    if (Array.isArray(value)) {
      return value.map(val => sdk.users.getGlobalUserID(val))
    } else {
      return sdk.users.getGlobalUserID(value)
    }
  }}
/>
