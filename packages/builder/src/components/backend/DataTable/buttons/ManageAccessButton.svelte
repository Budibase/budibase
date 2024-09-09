<script>
  import {
    ActionButton,
    Icon,
    Body,
    Input,
    Select,
    Label,
    List,
    ListItem,
    notifications,
  } from "@budibase/bbui"
  import { permissions as permissionsStore, roles } from "stores/builder"
  import DetailPopover from "components/common/DetailPopover.svelte"
  import EditRolesButton from "./EditRolesButton.svelte"
  import { PermissionSource } from "@budibase/types"
  import { capitalise } from "helpers"
  import InfoDisplay from "pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { Roles } from "constants/backend"

  export let resourceId

  const inheritedRoleId = "inherited"
  const builtins = [Roles.ADMIN, Roles.POWER, Roles.BASIC, Roles.PUBLIC]

  let permissions
  let showPopover = true
  let dependantsInfoMessage

  $: fetchPermissions(resourceId)
  $: loadDependantInfo(resourceId)
  $: roleMismatch = checkRoleMismatch(permissions)
  $: selectedRole = roleMismatch ? null : permissions?.[0]?.value
  $: readableRole = selectedRole
    ? $roles.find(x => x._id === selectedRole)?.name
    : null
  $: buttonLabel = readableRole ? `Access: ${readableRole}` : "Access"
  $: customRoles = $roles.filter(x => !builtins.includes(x._id))
  $: highlight = roleMismatch || selectedRole === Roles.PUBLIC

  const fetchPermissions = async id => {
    const res = await permissionsStore.forResourceDetailed(id)
    permissions = Object.entries(res?.permissions || {}).map(([perm, info]) => {
      let enriched = {
        permission: perm,
        value:
          info.permissionType === PermissionSource.INHERITED
            ? inheritedRoleId
            : info.role,
        options: [...$roles],
      }
      if (info.inheritablePermission) {
        enriched.options.unshift({
          _id: inheritedRoleId,
          name: `Inherit (${
            $roles.find(x => x._id === info.inheritablePermission).name
          })`,
        })
      }
      return enriched
    })
  }

  const checkRoleMismatch = permissions => {
    if (!permissions || permissions.length < 2) {
      return false
    }
    return (
      permissions[0].value !== permissions[1].value ||
      permissions[0].value === inheritedRoleId
    )
  }

  const loadDependantInfo = async resourceId => {
    const dependantsInfo = await permissionsStore.getDependantsInfo(resourceId)
    const resourceByType = dependantsInfo?.resourceByType
    if (resourceByType) {
      const total = Object.values(resourceByType).reduce((p, c) => p + c, 0)
      let resourceDisplay =
        Object.keys(resourceByType).length === 1 && resourceByType.view
          ? "view"
          : "resource"

      if (total === 1) {
        dependantsInfoMessage = `1 ${resourceDisplay} is inheriting this access`
      } else if (total > 1) {
        dependantsInfoMessage = `${total} ${resourceDisplay}s are inheriting this access`
      } else {
        dependantsInfoMessage = null
      }
    } else {
      dependantsInfoMessage = null
    }
  }

  const changePermission = async role => {
    try {
      await permissionsStore.save({
        level: "read",
        role,
        resource: resourceId,
      })
      await permissionsStore.save({
        level: "write",
        role,
        resource: resourceId,
      })
      await fetchPermissions(resourceId)
      notifications.success("Updated permissions")
    } catch (error) {
      console.error(error)
      notifications.error("Error updating permissions")
    }
  }
</script>

<DetailPopover title="Select access role" {showPopover}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="LockClosed"
      selected={open || highlight}
      quiet
      accentColor={highlight ? "#ff0000" : null}
    >
      {buttonLabel}
    </ActionButton>
  </svelte:fragment>

  {#if roleMismatch}
    <div class="row">
      <Label extraSmall grey>Level</Label>
      <Label extraSmall grey>Role</Label>
      {#each permissions as permission}
        <Input value={capitalise(permission.permission)} disabled />
        <Select
          placeholder={false}
          value={permission.value}
          on:change={e => changePermission(e.detail)}
          disabled
          options={permission.options}
          getOptionLabel={x => x.name}
          getOptionValue={x => x._id}
        />
      {/each}
    </div>
    <InfoDisplay
      error
      icon="Alert"
      body="Your previous configuration is shown above.<br/> Please choose a new role for both read and write access."
    />
  {/if}

  <List>
    <ListItem
      title="App admin"
      subtitle="Only app admins can access this data"
      hoverable
      selected={selectedRole === Roles.ADMIN}
      on:click={() => changePermission(Roles.ADMIN)}
    />
    <ListItem
      title="App power user"
      subtitle="Only app power users can access this data"
      hoverable
      selected={selectedRole === Roles.POWER}
      on:click={() => changePermission(Roles.POWER)}
    />
    <ListItem
      title="App user"
      subtitle="Only logged in users can access this data"
      hoverable
      selected={selectedRole === Roles.BASIC}
      on:click={() => changePermission(Roles.BASIC)}
    />
    <ListItem
      title="Public user"
      subtitle="Users are not required to log in to access this data"
      hoverable
      selected={selectedRole === Roles.PUBLIC}
      on:click={() => changePermission(Roles.PUBLIC)}
    />
    {#each customRoles as role}
      <ListItem
        title={role.name}
        hoverable
        selected={selectedRole === role._id}
        on:click={() => changePermission(role._id)}
      />
    {/each}
  </List>

  {#if dependantsInfoMessage}
    <InfoDisplay body={dependantsInfoMessage} />
  {/if}

  <EditRolesButton
    on:show={() => (showPopover = false)}
    on:hide={() => (showPopover = true)}
  />
</DetailPopover>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--spacing-s);
  }
</style>
