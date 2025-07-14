<script>
  import { Icon, Popover, RadioGroup, PhosphorIconPicker } from "@budibase/bbui"
  import { createEventDispatcher, getContext } from "svelte"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import DrawerBindableCombobox from "@/components/common/bindings/DrawerBindableCombobox.svelte"
  import CustomStylesSection from "../Component/CustomStylesSection.svelte"
  import ConditionalUISection from "../Component/ConditionalUISection.svelte"
  import RoleSelect from "@/components/common/RoleSelect.svelte"
  import SubLinksDrawer from "./SubLinksDrawer.svelte"
  import { screenStore } from "@/stores/builder"

  export let anchor
  export let navItem
  export let bindings

  let actionOptions = [
    {
      label: "Hide component",
      value: "hide",
    },
    {
      label: "Show component",
      value: "show",
    },
  ]

  const draggable = getContext("draggable")
  const dispatch = createEventDispatcher()
  const typeOptions = [
    { label: "Inline link", value: "link" },
    { label: "Open sub links", value: "sublinks" },
  ]

  let popover
  let open = false
  let drawerCount = 0

  $: urlOptions = $screenStore.screens
    .map(screen => screen.routing?.route)
    .filter(x => x != null)
    .sort()

  // Auto hide the component when another item is selected
  $: if (open && $draggable.selected !== navItem.id) {
    popover.hide()
  }

  // Open automatically if the component is marked as selected
  $: if (!open && $draggable.selected === navItem.id && popover) {
    popover.show()
    open = true
  }

  const update = setting => async value => {
    dispatch("change", {
      ...navItem,
      [setting]: value,
    })
  }
</script>

<Icon name={navItem.type === "sublinks" ? "caret-down" : "link"} size="S" />

<Popover
  bind:this={popover}
  on:open={() => {
    open = true
    $draggable.actions.select(navItem.id)
  }}
  on:close={() => {
    open = false
    if ($draggable.selected === navItem.id) {
      $draggable.actions.select()
    }
  }}
  {anchor}
  align="left-outside"
  showPopover={drawerCount === 0}
  clickOutsideOverride={drawerCount > 0}
  maxHeight={600}
  offset={18}
>
  <div class="settings">
    <PropertyControl
      label="Nav item"
      control={RadioGroup}
      value={navItem.type}
      onChange={update("type")}
      props={{
        options: typeOptions,
      }}
    />
    <PropertyControl
      label="Label"
      control={DrawerBindableInput}
      value={navItem.text}
      onChange={update("text")}
      {bindings}
      props={{
        updateOnChange: false,
      }}
      on:drawerShow={() => drawerCount++}
      on:drawerHide={() => drawerCount--}
    />
    <PropertyControl
      label="Icon"
      control={PhosphorIconPicker}
      value={navItem.icon}
      onChange={update("icon")}
      {bindings}
      props={{
        updateOnChange: false,
      }}
      on:drawerShow={() => drawerCount++}
      on:drawerHide={() => drawerCount--}
    />
    {#if navItem.type === "sublinks"}
      <PropertyControl
        label="Sub links"
        control={SubLinksDrawer}
        value={navItem.subLinks}
        onChange={update("subLinks")}
        {bindings}
        props={{
          navItem,
        }}
        on:drawerShow={() => drawerCount++}
        on:drawerHide={() => drawerCount--}
      />
    {:else}
      <PropertyControl
        label="Link"
        control={DrawerBindableCombobox}
        value={navItem.url}
        onChange={update("url")}
        {bindings}
        props={{
          options: urlOptions,
          appendBindingsAsOptions: false,
          placeholder: null,
        }}
        on:drawerShow={() => drawerCount++}
        on:drawerHide={() => drawerCount--}
      />
    {/if}
    <PropertyControl
      label="Access"
      control={RoleSelect}
      value={navItem.roleId}
      onChange={update("roleId")}
    />
    <CustomStylesSection
      componentInstance={navItem}
      componentDefinition={null}
      {bindings}
      iconTooltip="Navigation item"
      componentTitle={navItem.text}
      onSave={async value => {
        update("_styles")({ custom: value })
      }}
      on:drawerShow={() => drawerCount++}
      on:drawerHide={() => drawerCount--}
    />
    <ConditionalUISection
      componentInstance={navItem}
      componentDefinition={null}
      {bindings}
      componentBindings={[]}
      {actionOptions}
      onSave={async value => {
        update("_conditions")(value)
      }}
      on:drawerShow={() => drawerCount++}
      on:drawerHide={() => drawerCount--}
    />
  </div>
</Popover>

<style>
  .settings {
    background: var(--spectrum-alias-background-color-primary);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 8px;
    padding: var(--spacing-xl);
    overflow: scroll;
  }
  .settings :global(.property-group-container) {
    border: none;
  }
  .settings :global(.property-group-name),
  .settings :global(.property-panel) {
    padding: 5px 0;
  }
</style>
