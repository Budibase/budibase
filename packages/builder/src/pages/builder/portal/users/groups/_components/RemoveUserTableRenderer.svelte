<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "stores/portal"

  import { _ } from "../../../../../../../lang/i18n"

  export let value

  const userContext = getContext("users")

  const onClick = e => {
    e.stopPropagation()
    userContext.removeUser(value)
  }
</script>

<ActionButton disabled={!$auth.isAdmin} size="S" on:click={onClick}>
  {$_(
    "pages.builder.portal.users.groups._components.RemoveUserTableRenderer.Remove"
  )}
</ActionButton>
