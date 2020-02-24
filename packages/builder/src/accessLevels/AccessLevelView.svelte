<script>
  import { cloneDeep, map, some, filter } from "lodash/fp"
  import Textbox from "../common/Textbox.svelte"
  import Checkbox from "../common/Checkbox.svelte"
  import ButtonGroup from "../common/ButtonGroup.svelte"
  import Button from "../common/Button.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import { validateAccessLevels } from "../common/core"
  import ErrorsBox from "../common/ErrorsBox.svelte"

  export let level
  export let allPermissions
  export let onFinished
  export let isNew
  export let allLevels
  export let hierarchy
  export let actions

  let errors = []
  let clonedLevel = cloneDeep(level)

  const matchPermissions = (p1, p2) =>
    p1.type === p2.type &&
    ((!p2.nodeKey && !p1.nodeKey) || p2.nodeKey === p1.nodeKey)

  const hasPermission = hasPerm =>
    some(p => matchPermissions(p, hasPerm))(clonedLevel.permissions)

  $: permissionMatrix = map(p => ({
    permission: p,
    hasPermission: hasPermission(p),
  }))(allPermissions)

  const getPermissionName = perm =>
    perm.nodeKey ? `${perm.type} - ${perm.nodeKey}` : perm.type

  const save = () => {
    const newLevels = isNew
      ? [...allLevels, clonedLevel]
      : [...filter(l => l.name !== level.name)(allLevels), clonedLevel]

    errors = validateAccessLevels(hierarchy, actions, newLevels)

    if (errors.length > 0) return

    onFinished(clonedLevel)
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
  }
</script>

<div>

  <ErrorsBox {errors} />

  <form class="uk-form-horizontal">

    <Textbox label="Access Level Name" bind:text={clonedLevel.name} />

    {#each permissionMatrix as permission}
      <div>
        <Checkbox
          label={getPermissionName(permission.permission)}
          checked={permission.hasPermission}
          on:change={permissionChanged(permission.permission)} />
      </div>
    {/each}

  </form>

  <ButtonGroup style="margin-top: 10px">
    <ActionButton primary grouped on:click={save}>Save</ActionButton>
    <ActionButton alert grouped on:click={() => onFinished()}>
      Cancel
    </ActionButton>
  </ButtonGroup>

</div>

<style>

</style>
