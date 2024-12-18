<script>
  import { fade } from "svelte/transition"
  import { goto, params } from "@roxi/routify"
  import { Table, Heading, Layout } from "@budibase/bbui"
  import Spinner from "@/components/common/Spinner.svelte"
  import { TableNames, UNEDITABLE_USER_FIELDS } from "@/constants"
  import RoleCell from "./cells/RoleCell.svelte"
  import { createEventDispatcher } from "svelte"
  import { canBeSortColumn } from "@budibase/frontend-core"

  export let schema = {}
  export let data = []
  export let tableId
  export let title
  export let loading = false
  export let hideAutocolumns
  export let rowCount
  export let disableSorting = false
  export let customPlaceholder = false
  export let allowEditing = true
  export let allowClickRows

  const dispatch = createEventDispatcher()

  let selectedRows = []
  let customRenderers = []
  let parsedSchema = {}

  $: if (schema) {
    parsedSchema = Object.keys(schema).reduce((acc, key) => {
      acc[key] =
        typeof schema[key] === "string" ? { type: schema[key] } : schema[key]

      if (!canBeSortColumn(acc[key])) {
        acc[key].sortable = false
      }
      return acc
    }, {})
  }

  $: selectedRows, dispatch("selectionUpdated", selectedRows)
  $: isUsersTable = tableId === TableNames.USERS
  $: data && resetSelectedRows()
  $: {
    if (isUsersTable) {
      customRenderers = [
        {
          column: "roleId",
          component: RoleCell,
        },
      ]
      UNEDITABLE_USER_FIELDS.forEach(field => {
        if (parsedSchema[field]) {
          parsedSchema[field].editable = false
        }
      })
      if (parsedSchema.email) {
        parsedSchema.email.displayName = "Email"
      }
      if (parsedSchema.roleId) {
        parsedSchema.roleId.displayName = "Role"
      }
      if (parsedSchema.firstName) {
        parsedSchema.firstName.displayName = "First Name"
      }
      if (parsedSchema.lastName) {
        parsedSchema.lastName.displayName = "Last Name"
      }
      if (parsedSchema.status) {
        parsedSchema.status.displayName = "Status"
      }
    }
  }

  const resetSelectedRows = () => {
    selectedRows = []
  }

  const selectRelationship = ({ tableId, rowId, fieldName }) => {
    $goto(
      `/builder/app/${$params.application}/data/table/${tableId}/relationship/${rowId}/${fieldName}`
    )
  }
</script>

<Layout noPadding gap="S">
  <Layout noPadding gap="XS">
    {#if title}
      <div class="table-title">
        <Heading size="M">{title}</Heading>
        {#if loading}
          <div transition:fade|local>
            <Spinner size="10" />
          </div>
        {/if}
      </div>
    {/if}
    <div class="popovers">
      <slot />
    </div>
  </Layout>
  {#key tableId}
    <div class="table-wrapper">
      <Table
        {data}
        schema={parsedSchema}
        {loading}
        {customRenderers}
        {rowCount}
        {disableSorting}
        {customPlaceholder}
        allowEditRows={allowEditing}
        allowEditColumns={allowEditing}
        showAutoColumns={!hideAutocolumns}
        {allowClickRows}
        on:clickrelationship={e => selectRelationship(e.detail)}
        on:sort
      >
        <slot slot="placeholder" name="placeholder" />
      </Table>
    </div>
  {/key}
</Layout>

<style>
  .table-title {
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .table-title > div {
    margin-left: var(--spacing-xs);
  }
  .table-wrapper {
    overflow: hidden;
  }

  .popovers {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }
  .popovers :global(button) {
    font-weight: 600;
    margin-top: var(--spacing-l);
  }
  .popovers :global(button svg) {
    margin-right: var(--spacing-xs);
  }
</style>
