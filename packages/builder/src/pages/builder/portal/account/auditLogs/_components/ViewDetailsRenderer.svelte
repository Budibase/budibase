<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  import { _ } from "lang/i18n"

  export let row
  const auditLogs = getContext("auditLogs")
  const onClick = e => {
    e.stopPropagation()
    auditLogs.viewDetails(row)
  }
</script>

<ActionButton size="S" on:click={onClick}
  >{$_(
    "pages.builder.portal.account.auditLogs._components.ViewDetailsRendere.Details"
  )}</ActionButton
>
