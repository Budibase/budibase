<script>
  import { cloneDeep, map, some, filter } from "lodash/fp"
  import Textbox from "../common/Textbox.svelte"
  import Checkbox from "../common/Checkbox.svelte"
  import ButtonGroup from "../common/ButtonGroup.svelte"
  import Button from "../common/Button.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import { validateAccessLevels, nodeNameFromNodeKey } from "../common/core"
  import ErrorsBox from "../common/ErrorsBox.svelte"

  export let level
  export let allPermissions
  export let onFinished
  export let isNew
  export let allLevels
  export let hierarchy
  export let actions
  export let close
  export let title

  let errors = []
  let clonedLevel = cloneDeep(level)

  const matchPermissions = (p1, p2) =>
    p1.type === p2.type &&
    ((!p2.nodeKey && !p1.nodeKey) || p2.nodeKey === p1.nodeKey)

  const hasPermission = hasPerm =>
    clonedLevel.permissions.some(permission =>
      matchPermissions(permission, hasPerm)
    )

  $: permissionMatrix = allPermissions.map(permission => ({
    permission,
    hasPermission: hasPermission(permission),
  }))

  $: allPermissionsSelected = permissionMatrix.every(
    permission => permission.hasPermission
  )

  const getPermissionName = perm =>
    perm.nodeKey
      ? `${perm.type} - ${nodeNameFromNodeKey(hierarchy, perm.nodeKey)}`
      : perm.type

  const save = () => {
    const newLevels = isNew
      ? [...allLevels, clonedLevel]
      : [...allLevels.filter(l => l.name !== level.name), clonedLevel]

    errors = validateAccessLevels(hierarchy, actions, newLevels)

    if (errors.length > 0) return

    onFinished(clonedLevel)
    close()
  }

  const permissionChanged = perm => ev => {
    const hasPermission = ev.target.checked

    if (hasPermission) {
      clonedLevel.permissions.push(perm)
    } else {
      clonedLevel.permissions = filter(p => !matchPermissions(p, perm))(
        clonedLevel.permissions
      )
    }
    allPermissions = allPermissions
  }
</script>

<div>

  <div class="uk-modal-header">
    <h4 class="budibase__title--4">{title}</h4>
  </div>

  <ErrorsBox {errors} />

  <form on:submit|preventDefault class="uk-form-horizontal">

    <Textbox label="Access Level Name" bind:text={clonedLevel.name} />

    <h4 class="budibase__title--4">Permissions</h4>

    <Checkbox
      label={'Select All'}
      checked={allPermissionsSelected}
      on:change={ev => {
        permissionMatrix.forEach(permission =>
          permissionChanged(permission.permission)(ev)
        )
      }} />
    {#each permissionMatrix as permission}
      <div class="permission-container">
        <Checkbox
          label={getPermissionName(permission.permission)}
          checked={permission.hasPermission}
          on:change={permissionChanged(permission.permission)} />
      </div>
    {/each}

  </form>

  <div class="uk-modal-footer uk-text-right">
    <ButtonGroup>
      <ActionButton primary grouped on:click={save}>Save</ActionButton>
      <ActionButton alert grouped on:click={() => onFinished()}>
        Cancel
      </ActionButton>
    </ButtonGroup>
  </div>

</div>

<style>
  .permission-container {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
