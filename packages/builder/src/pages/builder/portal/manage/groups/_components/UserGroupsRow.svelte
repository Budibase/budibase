<script>
  import {
    Button,
    Icon,
    Body,
    ActionMenu,
    MenuItem,
    Modal,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import CreateEditGroupModal from "./CreateEditGroupModal.svelte"

  export let group
  export let deleteGroup
  export let saveGroup
  let modal
  function editGroup() {
    modal.show()
  }
</script>

<div class="title">
  <div class="name" style="display: flex; margin-left: var(--spacing-xl)">
    <div class="name" data-cy="app-name-link">
      <Body size="S">{group.name}</Body>
    </div>
  </div>
</div>
<div class="desktop tableElement">
  <Icon name="User" />
  <div style="margin-left: var(--spacing-l">
    {parseInt(group?.users?.length) || 0} user{parseInt(
      group?.users?.length
    ) === 1
      ? ""
      : "s"}
  </div>
</div>
<div class="desktop tableElement">
  <Icon name="WebPage" />

  <div style="margin-left: var(--spacing-l)">
    {parseInt(group?.apps?.length) || 0} app{parseInt(group?.apps?.length) === 1
      ? ""
      : "s"}
  </div>
</div>

<!--        <MenuItem on:click={() => deleteGroup(group)} icon="Delete"-->
<!--          >Delete</MenuItem-->
<!--        >-->

<!--        <MenuItem on:click={() => editGroup(group)} icon="Edit">Edit</MenuItem>-->
<style>
  .group-row-actions {
    display: flex;
    float: right;
    margin-right: var(--spacing-xl);
    grid-template-columns: 75px 75px;
    grid-gap: var(--spacing-xl);
  }
  .name {
    grid-gap: var(--spacing-xl);
    grid-template-columns: 75px 75px;
    align-items: center;
  }

  .name {
    text-decoration: none;
    overflow: hidden;
  }
  .name :global(.spectrum-Heading) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: calc(1.5 * var(--spacing-xl));
  }
  .title :global(h1:hover) {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
    transition: color 130ms ease;
  }

  @media (max-width: 640px) {
    .desktop {
      display: none !important;
    }
  }
</style>
