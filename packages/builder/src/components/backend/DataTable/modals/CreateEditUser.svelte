<script>
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import RowFieldControl from "../RowFieldControl.svelte"
  import * as backendApi from "../api"
  import { ModalContent, Select } from "@budibase/bbui"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  export let row = {}

  let errors = []

  $: creating = row?._id == null
  $: table = row.tableId
    ? $backendUiStore.tables.find(table => table._id === row?.tableId)
    : $backendUiStore.selectedTable
  $: tableSchema = getUserSchema(table)
  $: customSchemaKeys = getCustomSchemaKeys(tableSchema)

  const getUserSchema = table => {
    let schema = table?.schema ?? {}
    if (schema.username) {
      schema.username.name = "Username"
    }
    return schema
  }

  const getCustomSchemaKeys = schema => {
    let customSchema = { ...schema }
    delete customSchema["email"]
    delete customSchema["roleId"]
    delete customSchema["active"]
    return Object.entries(customSchema)
  }

  const saveRow = async () => {
    const rowResponse = await backendApi.saveRow(
      { ...row, tableId: table._id },
      table._id
    )

    if (rowResponse.errors) {
      if (Array.isArray(rowResponse.errors)) {
        errors = rowResponse.errors.map(error => ({ message: error }))
      } else {
        errors = Object.entries(rowResponse.errors)
          .map(([key, error]) => ({ dataPath: key, message: error }))
          .flat()
      }
      return false
    }

    notifier.success("User saved successfully.")
    backendUiStore.actions.rows.save(rowResponse)
  }
</script>

<ModalContent
  title={creating ? 'Create User' : 'Edit User'}
  confirmText={creating ? 'Create User' : 'Save User'}
  onConfirm={saveRow}>
  <ErrorsBox {errors} />
  <RowFieldControl
    meta={{ ...tableSchema.email, name: 'Email' }}
    bind:value={row.email}
    readonly={!creating} />
  <RowFieldControl
    meta={{ name: 'password', type: 'password' }}
    bind:value={row.password} />
  <!-- Defer rendering this select until roles load, otherwise the initial
       selection is always undefined -->
  <Select
    thin
    secondary
    label="Role"
    data-cy="roleId-select"
    bind:value={row.roleId}>
    <option value="">Choose an option</option>
    {#each $backendUiStore.roles as role}
      <option value={role._id}>{role.name}</option>
    {/each}
  </Select>
  <RowFieldControl
    meta={{ name: 'active', type: 'boolean' }}
    bind:value={row.active}
    defaultValue={true} />
  {#each customSchemaKeys as [key, meta]}
    {#if !meta.autocolumn}
      <RowFieldControl {meta} bind:value={row[key]} {creating} />
    {/if}
  {/each}
</ModalContent>
