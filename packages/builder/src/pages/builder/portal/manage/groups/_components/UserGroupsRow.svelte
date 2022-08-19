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
    <div style="background: {group.color};" class="circle">
      <div>
        <Icon size="M" name={group.icon} />
      </div>
    </div>
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
<div>
  <div class="group-row-actions">
    <div>
      <Button on:click={() => $goto(`./${group._id}`)} size="S" cta
        >Manage</Button
      >
    </div>
    <div>
      <ActionMenu align="right">
        <span slot="control">
          <Icon hoverable name="More" />
        </span>
        <MenuItem on:click={() => deleteGroup(group)} icon="Delete"
          >Delete</MenuItem
        >
        <MenuItem on:click={() => editGroup(group)} icon="Edit">Edit</MenuItem>
      </ActionMenu>
    </div>
  </div>
</div>

<Modal bind:this={modal}>
  <CreateEditGroupModal {group} {saveGroup} />
</Modal>

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
  .circle {
    border-radius: 50%;
    height: 30px;
    color: white;
    font-weight: bold;
    display: inline-block;
    font-size: 1.2em;
    width: 30px;
  }

  .tableElement {
    display: flex;
  }

  .circle > div {
    padding: calc(1.5 * var(--spacing-xs)) var(--spacing-xs);
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
