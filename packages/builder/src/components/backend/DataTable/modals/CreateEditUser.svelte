<script>
  import { tables, rows } from "stores/backend"
  import { roles } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import RowFieldControl from "../RowFieldControl.svelte"
  import * as backendApi from "../api"
  import { ModalContent, Select } from "@budibase/bbui"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  export let row = {}

  let errors = []

  $: creating = row?._id == null
  $: table = row.tableId
    ? $tables.list.find(table => table._id === row?.tableId)
    : $tables.selected
  $: tableSchema = getUserSchema(table)
  $: customSchemaKeys = getCustomSchemaKeys(tableSchema)
  $: if (!row.status) row.status = "active"

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
    delete customSchema["status"]
    return Object.entries(customSchema)
  }

  const saveRow = async () => {
    errors = []

    // Do some basic front end validation first
    if (!row.email) {
      errors = [...errors, { message: "Email is required" }]
    }
    if (!row.roleId) {
      errors = [...errors, { message: "Role is required" }]
    }
    if (errors.length) {
      return false
    }

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
    } else if (rowResponse.status === 400 || rowResponse.status === 500) {
      errors = [{ message: rowResponse.message }]
      return false
    }

    notifications.success("User saved successfully.")
    rows.save(rowResponse)
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
    label="Role"
    data-cy="roleId-select"
    bind:value={row.roleId}
    options={$roles}
    getOptionLabel={role => role.name}
    getOptionValue={role => role._id} />
  <Select
    label="Status"
    bind:value={row.status}
    options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]}
    getOptionLabel={status => status.label}
    getOptionValue={status => status.value} />
  {#each customSchemaKeys as [key, meta]}
    {#if !meta.autocolumn}
      <RowFieldControl {meta} bind:value={row[key]} {creating} />
    {/if}
  {/each}
</ModalContent>
