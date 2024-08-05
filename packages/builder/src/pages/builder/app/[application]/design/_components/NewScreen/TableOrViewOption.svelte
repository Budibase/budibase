<script>
  import { Icon, AbsTooltip } from "@budibase/bbui"
  import RoleIcon from "components/common/RoleIcon.svelte"

  export let tableOrView
  export let roles
  export let selected = false

  $: hideRoles = roles == undefined || roles?.loading
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div role="button" tabindex="0" class="datasource" class:selected on:click>
  <div class="content">
    <Icon name={tableOrView.icon} />
    <span>{tableOrView.name}</span>
  </div>

  <div class:hideRoles class="roles">
    <AbsTooltip
      type="info"
      text={`Screens that only read data will be generated with access "${roles?.read?.toLowerCase()}"`}
    >
      <div class="role">
        <span>read</span>
        <RoleIcon
          size="XS"
          id={roles?.read}
          disabled={roles?.loading !== false}
        />
      </div>
    </AbsTooltip>
    <AbsTooltip
      type="info"
      text={`Screens that write data will be generated with access "${roles?.write?.toLowerCase()}"`}
    >
      <div class="role">
        <span>write</span>
        <RoleIcon
          size="XS"
          id={roles?.write}
          disabled={roles?.loading !== false}
        />
      </div>
    </AbsTooltip>
  </div>
</div>

<style>
  .datasource {
    cursor: pointer;
    border: 1px solid var(--spectrum-global-color-gray-300);
    transition: 160ms all;
    border-radius: 4px;
    display: flex;
    align-items: center;
    user-select: none;
    background-color: var(--background);
  }

  .datasource :global(svg) {
    transition: 160ms all;
    color: var(--spectrum-global-color-gray-600);
  }

  .content {
    padding: var(--spectrum-alias-item-padding-s);
    display: flex;
    align-items: center;
    grid-gap: var(--spacing-m);
    min-width: 0;
  }

  .content span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .datasource:hover {
    border: 1px solid var(--grey-5);
  }

  .selected {
    border: 1px solid var(--blue) !important;
  }

  .roles {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: end;
    padding-right: var(--spectrum-alias-item-padding-s);
    opacity: 0.5;
    transition: opacity 160ms;
  }

  .hideRoles {
    opacity: 0;
    pointer-events: none;
  }

  .role {
    display: flex;
    align-items: center;
  }

  .role span {
    font-size: 11px;
    margin-right: 5px;
  }
</style>
