<script>
  import { ModalContent, Select, Input, Button } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "api"
  import { notifications } from "@budibase/bbui"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import { roles } from "stores/backend"
  import { _ } from "../../../../../lang/i18n"

  const BASE_ROLE = { _id: "", inherits: "BASIC", permissionId: "write" }

  let basePermissions = []
  let selectedRole = BASE_ROLE
  let errors = []
  let builtInRoles = [
    $_("components.backend.DataTable.modals.EditRoles.Admin"),
    $_("components.backend.DataTable.modals.EditRoles.Power"),
    $_("components.backend.DataTable.modals.EditRoles.Basic"),
    $_("components.backend.DataTable.modals.EditRoles.Public"),
  ]
  // Don't allow editing of public role
  $: editableRoles = $roles.filter(role => role._id !== "PUBLIC")
  $: selectedRoleId = selectedRole._id
  $: otherRoles = editableRoles.filter(role => role._id !== selectedRoleId)
  $: isCreating = selectedRoleId == null || selectedRoleId === ""

  $: hasUniqueRoleName = !otherRoles
    ?.map(role => role.name)
    ?.includes(selectedRole.name)

  $: valid =
    selectedRole.name &&
    selectedRole.inherits &&
    selectedRole.permissionId &&
    !builtInRoles.includes(selectedRole.name)

  $: shouldDisableRoleInput =
    builtInRoles.includes(selectedRole.name) &&
    selectedRole.name?.toLowerCase() === selectedRoleId?.toLowerCase()

  const fetchBasePermissions = async () => {
    try {
      basePermissions = await API.getBasePermissions()
    } catch (error) {
      notifications.error(
        $_("components.backend.DataTable.modals.EditRoles.Error_fetching")
      )
      basePermissions = []
    }
  }

  // Changes the selected role
  const changeRole = event => {
    const id = event?.detail
    const role = $roles.find(role => role._id === id)
    if (role) {
      selectedRole = {
        ...role,
        inherits: role.inherits ?? "",
        permissionId: role.permissionId ?? "",
      }
    } else {
      selectedRole = BASE_ROLE
    }
    errors = []
  }

  // Saves or creates the selected role
  const saveRole = async () => {
    errors = []

    // Clean up empty strings
    const keys = ["_id", "inherits", "permissionId"]
    keys.forEach(key => {
      if (selectedRole[key] === "") {
        delete selectedRole[key]
      }
    })

    // Validation
    if (!selectedRole.name || selectedRole.name.trim() === "") {
      errors.push({
        message: $_("components.backend.DataTable.modals.EditRoles.enter_role"),
      })
    }
    if (!selectedRole.permissionId) {
      errors.push({
        message: $_(
          "components.backend.DataTable.modals.EditRoles.choose_permissions"
        ),
      })
    }
    if (errors.length) {
      return false
    }

    // Save/create the role
    try {
      await roles.save(selectedRole)
      notifications.success(
        $_("components.backend.DataTable.modals.EditRoles.Role_saved")
      )
    } catch (error) {
      notifications.error(
        $_("components.backend.DataTable.modals.EditRoles.Error_saving")
      )
      return false
    }
  }

  // Deletes the selected role
  const deleteRole = async () => {
    try {
      await roles.delete(selectedRole)
      changeRole()
      notifications.success(
        $_("components.backend.DataTable.modals.EditRoles.Role_deleted")
      )
    } catch (error) {
      notifications.error(
        $_("components.backend.DataTable.modals.EditRoles.Error_deleting")
      )
    }
  }

  onMount(fetchBasePermissions)
</script>

<ModalContent
  title={$_("components.backend.DataTable.modals.EditRoles.Edit_Roles")}
  confirmText={isCreating
    ? $_("components.backend.DataTable.modals.EditRoles.Create")
    : $_("components.backend.DataTable.modals.EditRoles.Save")}
  onConfirm={saveRole}
  disabled={!valid || !hasUniqueRoleName}
>
  {#if errors.length}
    <ErrorsBox {errors} />
  {/if}
  <Select
    thin
    secondary
    label={$_("components.backend.DataTable.modals.EditRoles.Role")}
    value={selectedRoleId}
    on:change={changeRole}
    options={editableRoles}
    placeholder={$_(
      "components.backend.DataTable.modals.EditRoles.Create_role"
    )}
    getOptionValue={role => role._id}
    getOptionLabel={role => role.name}
  />
  {#if selectedRole}
    <Input
      label={$_("components.backend.DataTable.modals.EditRoles.Name")}
      bind:value={selectedRole.name}
      disabled={shouldDisableRoleInput}
      error={!hasUniqueRoleName
        ? $_("components.backend.DataTable.modals.EditRoles.unique_name")
        : null}
    />
    <Select
      label={$_("components.backend.DataTable.modals.EditRoles.Ingerits_Role")}
      bind:value={selectedRole.inherits}
      options={selectedRole._id === "BASIC" ? $roles : otherRoles}
      getOptionValue={role => role._id}
      getOptionLabel={role => role.name}
      disabled={shouldDisableRoleInput}
    />
    <Select
      label={$_(
        "components.backend.DataTable.modals.EditRoles.Base_Permissions"
      )}
      bind:value={selectedRole.permissionId}
      options={basePermissions}
      getOptionValue={x => x._id}
      getOptionLabel={x => x.name}
      disabled={shouldDisableRoleInput}
    />
  {/if}
  <div slot="footer">
    {#if !isCreating && !builtInRoles.includes(selectedRole.name)}
      <Button warning on:click={deleteRole}
        >{$_("components.backend.DataTable.modals.EditRoles.Delete")}</Button
      >
    {/if}
  </div>
</ModalContent>
