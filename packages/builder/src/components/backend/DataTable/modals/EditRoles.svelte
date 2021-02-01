<script>
  import { ModalContent, Select, Input, Button } from "@budibase/bbui"
  import { onMount } from "svelte"
  import api from "builderStore/api"
  import { notifier } from "builderStore/store/notifications"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import { backendUiStore } from "builderStore"

  let permissions = []
  let selectedRole = {}
  let errors = []
  let builtInRoles = ['Admin', 'Power', 'Basic', 'Public']
  $: selectedRoleId = selectedRole._id
  $: otherRoles = $backendUiStore.roles.filter(
    role => role._id !== selectedRoleId
  )
  $: isCreating = selectedRoleId == null || selectedRoleId === ""

  const fetchPermissions = async () => {
    const permissionsResponse = await api.get("/api/permissions")
    permissions = await permissionsResponse.json()
  }

  // Changes the selected role
  const changeRole = event => {
    const id = event?.target?.value
    const role = $backendUiStore.roles.find(role => role._id === id)
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
    const response = await backendUiStore.actions.roles.save(selectedRole)
    if (response.status === 200) {
      notifier.success("Role saved successfully.")
    } else {
      notifier.danger("Error saving role.")
      return false
    }
  }

  // Deletes the selected role
  const deleteRole = async () => {
    const response = await backendUiStore.actions.roles.delete(selectedRole)
    if (response.status === 200) {
      changeRole()
      notifier.success("Role deleted successfully.")
    } else {
      notifier.danger("Error deleting role.")
    }
  }

  onMount(fetchPermissions)
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
    {#each $backendUiStore.roles as role}
      <option value={role._id}>{role.name}</option>
    {/each}
  </Select>
  {#if selectedRole}
    <Input label="Name" bind:value={selectedRole.name} thin disabled={builtInRoles.includes(selectedRole.name)}/>
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
