<script>
  import { PermissionSource } from "@budibase/types"
  import { roles, permissions as permissionsStore } from "stores/backend"
  import {
    Label,
    Input,
    Select,
    notifications,
    Body,
    ModalContent,
    Tags,
    Tag,
    Icon,
  } from "@budibase/bbui"
  import { capitalise } from "helpers"
  import { get } from "svelte/store"

  export let resourceId
  export let permissions

  const inheritedRoleId = "inherited"

  async function changePermission(level, role) {
    try {
      if (role === inheritedRoleId) {
        await permissionsStore.remove({
          level,
          role,
          resource: resourceId,
        })
      } else {
        await permissionsStore.save({
          level,
          role,
          resource: resourceId,
        })
      }

      // Show updated permissions in UI: REMOVE
      permissions = await permissionsStore.forResourceDetailed(resourceId)
      notifications.success("Updated permissions")
    } catch (error) {
      notifications.error("Error updating permissions")
    }
  }

  $: computedPermissions = Object.entries(permissions.permissions).reduce(
    (p, [level, roleInfo]) => {
      p[level] = {
        selectedValue:
          roleInfo.permissionType === PermissionSource.INHERITED
            ? inheritedRoleId
            : roleInfo.role,
        options: [...get(roles)],
      }

      if (roleInfo.inheritablePermission) {
        p[level].inheritOption = roleInfo.inheritablePermission
        p[level].options.unshift({
          _id: inheritedRoleId,
          name: `Inherit (${
            get(roles).find(x => x._id === roleInfo.inheritablePermission).name
          })`,
        })
      }
      return p
    },
    {}
  )

  $: requiresPlanToModify = permissions.requiresPlanToModify

  let dependantsInfoMessage
  async function loadDependantInfo() {
    const dependantsInfo = await permissionsStore.getDependantsInfo(resourceId)

    const resourceByType = dependantsInfo?.resourceByType

    if (resourceByType) {
      const total = Object.values(resourceByType).reduce((p, c) => p + c, 0)
      let resourceDisplay =
        Object.keys(resourceByType).length === 1 && resourceByType.view
          ? "view"
          : "resource"

      if (total === 1) {
        dependantsInfoMessage = `1 ${resourceDisplay} is inheriting this access.`
      } else if (total > 1) {
        dependantsInfoMessage = `${total} ${resourceDisplay}s are inheriting this access.`
      }
    }
  }
  loadDependantInfo()
</script>

<ModalContent showCancelButton={false} confirmText="Done">
  <span slot="header">
    Manage Access
    {#if requiresPlanToModify}
      <span class="lock-tag">
        <Tags>
          <Tag icon="LockClosed">{capitalise(requiresPlanToModify)}</Tag>
        </Tags>
      </span>
    {/if}
  </span>
  <Body size="S">Specify the minimum access level role for this data.</Body>
  <div class="row">
    <Label extraSmall grey>Level</Label>
    <Label extraSmall grey>Role</Label>
    {#each Object.keys(computedPermissions) as level}
      <Input value={capitalise(level)} disabled />
      <Select
        disabled={requiresPlanToModify}
        placeholder={false}
        value={computedPermissions[level].selectedValue}
        on:change={e => changePermission(level, e.detail)}
        options={computedPermissions[level].options}
        getOptionLabel={x => x.name}
        getOptionValue={x => x._id}
      />
    {/each}
  </div>

  {#if dependantsInfoMessage}
    <div class="inheriting-resources">
      <Icon name="Alert" />
      <Body size="S">
        <i>
          {dependantsInfoMessage}
        </i>
      </Body>
    </div>
  {/if}
</ModalContent>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--spacing-s);
  }

  .lock-tag {
    padding-left: var(--spacing-s);
  }

  .inheriting-resources {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
