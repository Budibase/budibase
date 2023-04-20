<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "stores/portal"

  import { _ } from "../../../../../../../lang/i18n"

  export let value

  const groupContext = getContext("groups")

  const onClick = e => {
    e.stopPropagation()
    groupContext.removeGroup(value)
  }
</script>

<ActionButton disabled={!$auth.isAdmin} size="S" on:click={onClick}>
  {$_(
    "pages.builder.portal.users.users._components.RemoveGroupTableRenderer.Remove"
  )}
</ActionButton>
