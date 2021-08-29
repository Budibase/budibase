<script>
  import { ModalContent, Select, Input, Button } from "@budibase/bbui"
  import { onMount } from "svelte"
  import api from "builderStore/api"
  import { notifications } from "@budibase/bbui"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import { roles } from "stores/backend"
  import { _ as t } from "svelte-i18n"

  const BASE_ROLE = { _id: "", inherits: "BASIC", permissionId: "Read/Write" }

  let basePermissions = []
  let selectedRole = BASE_ROLE
  let errors = []
  let builtInRoles = ["Admin", "Power", "Basic", "Public"]
  // Don't allow editing of public role
  $: editableRoles = $roles.filter(role => role._id !== "PUBLIC")
  $: selectedRoleId = selectedRole._id
  $: otherRoles = editableRoles.filter(role => role._id !== selectedRoleId)
  $: isCreating = selectedRoleId == null || selectedRoleId === ""
  $: valid =
    selectedRole.name &&
    selectedRole.inherits &&
    selectedRole.permissionId &&
    !builtInRoles.includes(selectedRole.name)

  const fetchBasePermissions = async () => {
    const permissionsResponse = await api.get("/api/permission/builtin")
    basePermissions = await permissionsResponse.json()
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
      errors.push({ message: $t('please-enter-a-role-name') })
    }
    if (!selectedRole.permissionId) {
      errors.push({ message: $t('please-choose-permissions') })
    }
    if (errors.length) {
      return false
    }

    // Save/create the role
    const response = await roles.save(selectedRole)
    if (response.status === 200) {
      notifications.success($t('role-saved-successfully'))
    } else {
      notifications.error($t('error-saving-role'))
      return false
    }
  }

  // Deletes the selected role
  const deleteRole = async () => {
    const response = await roles.delete(selectedRole)
    if (response.status === 200) {
      changeRole()
      notifications.success($t('role-deleted-successfully'))
    } else {
      notifications.error($t('error-deleting-role'))
    }
  }

  onMount(fetchBasePermissions)
</script>

<ModalContent
  title={ $t('edit-roles') }
  confirmText={isCreating ? $t('create') : $t('save')}
  onConfirm={saveRole}
  disabled={!valid}
>
  {#if errors.length}
    <ErrorsBox {errors} />
  {/if}
  <Select
    thin
    secondary
    label={ $t('role') }
    value={selectedRoleId}
    on:change={changeRole}
    options={editableRoles}
    placeholder={ $t('create-new-role') }
    getOptionValue={role => role._id}
    getOptionLabel={role => role.name}
  />
  {#if selectedRole}
    <Input
      label={ $t('name-0') }
      bind:value={selectedRole.name}
      disabled={builtInRoles.includes(selectedRole.name)}
    />
    <Select
      label={ $t('inherits-role') }
      bind:value={selectedRole.inherits}
      options={otherRoles}
      getOptionValue={role => role._id}
      getOptionLabel={role => role.name}
      disabled={builtInRoles.includes(selectedRole.name)}
    />
    <Select
      label={ $t('base-permissions') }
      bind:value={selectedRole.permissionId}
      options={basePermissions}
      getOptionValue={x => x._id}
      getOptionLabel={x => x.name}
      disabled={builtInRoles.includes(selectedRole.name)}
    />
  {/if}
  <div slot="footer">
    {#if !isCreating}
      <Button warning on:click={deleteRole}>{ $t('delete-0') }</Button>
    {/if}
  </div>
</ModalContent>
