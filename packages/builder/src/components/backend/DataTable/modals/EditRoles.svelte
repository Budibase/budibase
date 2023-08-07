<script>
  import { keepOpen, ModalContent, Select, Input, Button } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "api"
  import { notifications } from "@budibase/bbui"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import { roles } from "stores/backend"

  const BASE_ROLE = { _id: "", inherits: "BASIC", permissionId: "write" }

  let basePermissions = []
  let selectedRole = BASE_ROLE
  let errors = []
  let builtInRoles = ["Admin", "Power", "Basic", "Public"]
  let validRegex = /^[a-zA-Z0-9_]*$/
  // Don't allow editing of public role
  $: editableRoles = $roles.filter(role => role._id !== "PUBLIC")
  $: selectedRoleId = selectedRole._id
  $: otherRoles = editableRoles.filter(role => role._id !== selectedRoleId)
  $: isCreating = selectedRoleId == null || selectedRoleId === ""

  $: roleNameError = getRoleNameError(selectedRole.name)

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
      notifications.error("Error fetching base permission options")
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
      errors.push({ message: "Please enter a role name" })
    }
    if (!selectedRole.permissionId) {
      errors.push({ message: "Please choose permissions" })
    }
    if (errors.length) {
      return keepOpen
    }

    // Save/create the role
    try {
      await roles.save(selectedRole)
      notifications.success("Role saved successfully")
    } catch (error) {
      notifications.error(`Error saving role - ${error.message}`)
      return keepOpen
    }
  }

  // Deletes the selected role
  const deleteRole = async () => {
    try {
      await roles.delete(selectedRole)
      changeRole()
      notifications.success("Role deleted successfully")
    } catch (error) {
      notifications.error(`Error deleting role - ${error.message}`)
      return false
    }
  }

  const getRoleNameError = name => {
    const hasUniqueRoleName = !otherRoles
      ?.map(role => role.name)
      ?.includes(name)
    const invalidRoleName = !validRegex.test(name)
    if (!hasUniqueRoleName) {
      return "Select a unique role name."
    } else if (invalidRoleName) {
      return "Please enter a role name consisting of only alphanumeric symbols and underscores"
    }
  }

  onMount(fetchBasePermissions)
</script>

<ModalContent
  title="Edit Roles"
  confirmText={isCreating ? "Create" : "Save"}
  onConfirm={saveRole}
  disabled={!valid || roleNameError}
>
  {#if errors.length}
    <ErrorsBox {errors} />
  {/if}
  <Select
    thin
    secondary
    label="Role"
    value={selectedRoleId}
    on:change={changeRole}
    options={editableRoles}
    placeholder="Create new role"
    getOptionValue={role => role._id}
    getOptionLabel={role => role.name}
  />
  {#if selectedRole}
    <Input
      label="Name"
      bind:value={selectedRole.name}
      disabled={!!selectedRoleId}
      error={roleNameError}
    />
    <Select
      label="Inherits Role"
      bind:value={selectedRole.inherits}
      options={selectedRole._id === "BASIC" ? $roles : otherRoles}
      getOptionValue={role => role._id}
      getOptionLabel={role => role.name}
      disabled={shouldDisableRoleInput}
    />
    <Select
      label="Base Permissions"
      bind:value={selectedRole.permissionId}
      options={basePermissions}
      getOptionValue={x => x._id}
      getOptionLabel={x => x.name}
      disabled={shouldDisableRoleInput}
    />
  {/if}
  <div slot="footer">
    {#if !isCreating && !builtInRoles.includes(selectedRole.name)}
      <Button warning on:click={deleteRole}>Delete</Button>
    {/if}
  </div>
</ModalContent>
