<script>
  import TableDataTable from "components/backend/DataTable/TableDataTable.svelte"
  import { tables, database } from "stores/backend"
  import { Banner } from "@budibase/bbui"

  const verifyAutocolumns = table => {
    // Check for duplicates
    return Object.values(table?.schema || {}).reduce((acc, fieldSchema) => {
      if (!fieldSchema.autocolumn || !fieldSchema.subtype) {
        return acc
      }
      let fieldKey = fieldSchema.tableId
        ? `${fieldSchema.tableId}-${fieldSchema.subtype}`
        : fieldSchema.subtype
      acc[fieldKey] = acc[fieldKey] || []
      acc[fieldKey].push(fieldSchema)
      return acc
    }, {})
  }

  $: autoColumnStatus = verifyAutocolumns($tables?.selected)
  $: duplicates = Object.values(autoColumnStatus).reduce((acc, status) => {
    if (status.length > 1) {
      acc = [...acc, ...status]
    }
    return acc
  }, [])
  $: invalidColumnText = duplicates.map(entry => {
    return `${entry.name} (${entry.subtype})`
  })
</script>

{#if $database?._id && $tables?.selected?.name}
  {#if duplicates?.length}
    <div class="alert-wrap">
      <Banner type="warning" showCloseButton={false}>
        {`Schema Invalid - There are duplicate auto column types defined in this schema.
      Please delete the duplicate entries where appropriate: -
      ${invalidColumnText.join(", ")}`}
      </Banner>
    </div>
  {/if}
  <TableDataTable />
{:else}
  <i>Create your first table to start building</i>
{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
  .alert-wrap {
    display: flex;
    width: 100%;
  }
  .alert-wrap :global(> *) {
    flex: 1;
  }
</style>
