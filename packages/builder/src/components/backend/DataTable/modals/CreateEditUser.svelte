<script>
  import { createEventDispatcher } from "svelte"
  import { tables } from "stores/backend"
  import { roles } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import RowFieldControl from "../RowFieldControl.svelte"
  import { API } from "api"
  import { ModalContent, Select, Link } from "@budibase/bbui"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import { goto } from "@roxi/routify"
  import { _ } from "../../../../../lang/i18n"

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
      schema.username.name = $_(
        "components.backend.DataTable.modals.CreateEditUser.Username"
      )
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
      errors = [
        ...errors,
        {
          message: $_(
            "components.backend.DataTable.modals.CreateEditUser.Email_required"
          ),
        },
      ]
    }
    if (!row.roleId) {
      errors = [
        ...errors,
        {
          message: $_(
            "components.backend.DataTable.modals.CreateEditUser.Role_required"
          ),
        },
      ]
    }
    if (errors.length) {
      return false
    }

    try {
      await API.saveRow({ ...row, tableId: table._id })
      notifications.success(
        $_(
          "components.backend.DataTable.modals.CreateEditUser.User_successfully"
        )
      )
      dispatch("updaterows")
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
          errors = [
            {
              message:
                response?.message ||
                $_(
                  "components.backend.DataTable.modals.CreateEditUser.Unknown_error"
                ),
            },
          ]
        }
      } else {
        notifications.error(
          $_("components.backend.DataTable.modals.CreateEditUser.Error_saving")
        )
      }
      // Prevent closing the modal on errors
      return false
    }
  }
</script>

<ModalContent
  title={creating
    ? $_("components.backend.DataTable.modals.CreateEditUser.Create User")
    : $_("components.backend.DataTable.modals.CreateEditUser.Edit User")}
  confirmText={creating
    ? $_("components.backend.DataTable.modals.CreateEditUser.Create User")
    : $_("components.backend.DataTable.modals.CreateEditUser.Save User")}
  onConfirm={saveRow}
>
  <ErrorsBox {errors} />
  <!-- need to explain to the user the readonly fields -->
  {#if !creating}
    <div>
      {$_("components.backend.DataTable.modals.CreateEditUser.cannot_changed")}
      <Link on:click={$goto("/builder/portal/manage/users")}
        >{$_(
          "components.backend.DataTable.modals.CreateEditUser.user_portal"
        )}</Link
      >
      {$_("components.backend.DataTable.modals.CreateEditUser.do_this")}
    </div>
  {/if}
  <RowFieldControl
    meta={{
      ...tableSchema.email,
      name: $_("components.backend.DataTable.modals.CreateEditUser.Email"),
    }}
    bind:value={row.email}
    readonly={!creating}
  />
  <RowFieldControl
    meta={{
      ...tableSchema.firstName,
      name: $_("components.backend.DataTable.modals.CreateEditUser.First_Name"),
    }}
    bind:value={row.firstName}
    readonly={!creating}
  />
  <RowFieldControl
    meta={{
      ...tableSchema.lastName,
      name: $_("components.backend.DataTable.modals.CreateEditUser.Last_Name"),
    }}
    bind:value={row.lastName}
    readonly={!creating}
  />
  <!-- Defer rendering this select until roles load, otherwise the initial
       selection is always undefined -->
  <Select
    label={$_("components.backend.DataTable.modals.CreateEditUser.Role")}
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
