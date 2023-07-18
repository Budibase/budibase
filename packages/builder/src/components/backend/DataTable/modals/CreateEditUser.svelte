<script>
  import { createEventDispatcher } from "svelte"
  import { tables } from "stores/backend"
  import { roles } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import RowFieldControl from "../RowFieldControl.svelte"
  import { API } from "api"
  import { keepOpen, ModalContent, Select, Link } from "@budibase/bbui"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import { goto } from "@roxi/routify"

  export let row = {}

  const dispatch = createEventDispatcher()
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
    delete customSchema["firstName"]
    delete customSchema["lastName"]
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
      return keepOpen
    }

    try {
      const res = await API.saveRow({ ...row, tableId: table._id })
      notifications.success("User saved successfully")
      dispatch("updaterows", res.id)
    } catch (error) {
      if (error.handled) {
        const response = error.json
        if (response?.errors) {
          if (Array.isArray(response.errors)) {
            errors = response.errors.map(error => ({ message: error }))
          } else {
            errors = Object.entries(response.errors)
              .map(([key, error]) => ({ dataPath: key, message: error }))
              .flat()
          }
        } else if (error.status === 400 && response?.validationErrors) {
          errors = Object.keys(response.validationErrors).map(field => ({
            message: `${field} ${response.validationErrors[field][0]}`,
          }))
        } else {
          errors = [{ message: response?.message || "Unknown error" }]
        }
      } else {
        notifications.error("Error saving user")
      }

      return keepOpen
    }
  }
</script>

<ModalContent
  title={creating ? "Create User" : "Edit User"}
  confirmText={creating ? "Create User" : "Save User"}
  onConfirm={saveRow}
>
  <ErrorsBox {errors} />
  <!-- need to explain to the user the readonly fields -->
  {#if !creating}
    <div>
      A user's email, role, first and last names cannot be changed from within
      the app builder. Please go to the
      <Link on:click={$goto("/builder/portal/users/users")}>user portal</Link>
      to do this.
    </div>
  {/if}
  <RowFieldControl
    meta={{ ...tableSchema.email, name: "Email" }}
    bind:value={row.email}
    readonly={!creating}
  />
  <RowFieldControl
    meta={{ ...tableSchema.firstName, name: "First Name" }}
    bind:value={row.firstName}
    readonly={!creating}
  />
  <RowFieldControl
    meta={{ ...tableSchema.lastName, name: "Last Name" }}
    bind:value={row.lastName}
    readonly={!creating}
  />
  <!-- Defer rendering this select until roles load, otherwise the initial
       selection is always undefined -->
  <Select
    label="Role"
    bind:value={row.roleId}
    options={$roles}
    getOptionLabel={role => role.name}
    getOptionValue={role => role._id}
    disabled={!creating}
  />
  {#each customSchemaKeys as [key, meta]}
    {#if !meta.autocolumn}
      <RowFieldControl {meta} bind:value={row[key]} {creating} />
    {/if}
  {/each}
</ModalContent>
