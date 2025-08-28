<script>
  import { AUTH_TYPE_LABELS } from "./authTypes"

  export let value

  const renderAuthType = value => {
    return AUTH_TYPE_LABELS.filter(type => type.value === value).map(
      type => type.label
    )
  }
</script>

{renderAuthType(value)}
