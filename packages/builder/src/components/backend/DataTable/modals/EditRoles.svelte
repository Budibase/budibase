<script>
  import { ModalContent, Select, Input, Button } from "@budibase/bbui"
  import { onMount } from "svelte"
  import api from "builderStore/api"
  import { notifier } from "builderStore/store/notifications"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  let roles = []
  let permissions = []
  let selectedRole = {}
  let errors = []
  $: selectedRoleId = selectedRole._id
  $: otherRoles = roles.filter(role => role._id !== selectedRoleId)
  $: isCreating = selectedRoleId == null || selectedRoleId === ""

  // Loads available roles and permissions from the server
  const fetchRoles = async () => {
    const rolesResponse = await api.get("/api/roles")
    roles = await rolesResponse.json()
    const permissionsResponse = await api.get("/api/permissions")
    permissions = await permissionsResponse.json()
  }

  // Changes the seleced role
  const changeRole = event => {
    const id = event?.target?.value
    const role = roles.find(role => role._id === id)
    if (role) {
      selectedRole = {
        ...role,
        inherits: role.inherits ?? "",
        permissionId: role.permissionId ?? "",
      }
    } else {
      selectedRole = { _id: "", inherits: "", permissionId: "" }
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
      return false
    }

    // Save/create the role
    const response = await api.post("/api/roles", selectedRole)
    if (response.status === 200) {
      notifier.success("Role saved successfully.")
    } else {
      notifier.danger("Error saving role.")
      return false
    }
  }

  // Deletes the selected role
  const deleteRole = async () => {
    const response = await api.delete(
      `/api/roles/${selectedRole._id}/${selectedRole._rev}`
    )
    if (response.status === 200) {
      await fetchRoles()
      changeRole()
      notifier.success("Role deleted successfully.")
    } else {
      notifier.danger("Error deleting role.")
    }
  }

  onMount(fetchRoles)
</script>

<ModalContent
  title="Edit Roles"
  confirmText={isCreating ? 'Create' : 'Save'}
  onConfirm={saveRole}>
  {#if errors.length}
    <ErrorsBox {errors} />
  {/if}
  <Select
    thin
    secondary
    label="Role"
    value={selectedRoleId}
    on:change={changeRole}>
    <option value="">Create new role</option>
    {#each roles as role}
      <option value={role._id}>{role.name}</option>
    {/each}
  </Select>
  {#if selectedRole}
    <Input label="Name" bind:value={selectedRole.name} thin />
    <Select
      thin
      secondary
      label="Inherits Role"
      bind:value={selectedRole.inherits}>
      <option value="">None</option>
      {#each otherRoles as role}
        <option value={role._id}>{role.name}</option>
      {/each}
    </Select>
    <Select
      thin
      secondary
      label="Permissions"
      bind:value={selectedRole.permissionId}>
      <option value="">Choose permissions</option>
      {#each permissions as permission}
        <option value={permission._id}>{permission.name}</option>
      {/each}
    </Select>
  {/if}
  <div slot="footer">
    {#if !isCreating}
      <Button red on:click={deleteRole}>Delete</Button>
    {/if}
  </div>
</ModalContent>
