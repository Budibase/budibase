<script>
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
  } from "@budibase/bbui"
  import { capitalise } from "helpers"
  import { get } from "svelte/store"

  export let resourceId
  export let permissions

  async function changePermission(level, role) {
    try {
      if (role === "inherited") {
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
          roleInfo.permissionType === "INHERITED" ? "inherited" : roleInfo.role,
        options: [...get(roles)],
      }

      if (roleInfo.inheritablePermission) {
        p[level].inheritOption = roleInfo.inheritablePermission
        p[level].options.unshift({
          _id: "inherited",
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
</script>

<ModalContent showCancelButton={false} confirmText="Done">
  <span slot="header">
    Manage Access
    {#if requiresPlanToModify}
      <span class="lock-tag">
        <Tags>
          <Tag icon="LockClosed">{requiresPlanToModify}</Tag>
        </Tags>
      </span>
    {/if}
  </span>
  {#if requiresPlanToModify}
    <Body size="S">{requiresPlanToModify}</Body>
  {:else}
    <Body size="S">Specify the minimum access level role for this data.</Body>
    <div class="row">
      <Label extraSmall grey>Level</Label>
      <Label extraSmall grey>Role</Label>
      {#each Object.keys(computedPermissions) as level}
        <Input value={capitalise(level)} disabled />
        <Select
          placeholder={false}
          value={computedPermissions[level].selectedValue}
          on:change={e => changePermission(level, e.detail)}
          options={computedPermissions[level].options}
          getOptionLabel={x => x.name}
          getOptionValue={x => x._id}
        />
      {/each}
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
</style>
