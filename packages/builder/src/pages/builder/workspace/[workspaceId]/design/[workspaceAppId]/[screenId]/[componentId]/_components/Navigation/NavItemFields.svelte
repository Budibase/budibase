<script lang="ts">
  import { RadioGroup, PhosphorIconPicker } from "@budibase/bbui"
  import {
    Constants,
    NavigationUtils,
    RoleUtils,
  } from "@budibase/frontend-core"
  import type { AppNavigationLink, EnrichedBinding } from "@budibase/types"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import DrawerBindableCombobox from "@/components/common/bindings/DrawerBindableCombobox.svelte"
  import CustomStylesSection from "../Component/CustomStylesSection.svelte"
  import ConditionalUISection from "../Component/ConditionalUISection.svelte"
  import RoleSelect from "@/components/common/RoleSelect.svelte"
  import { screenStore, roles } from "@/stores/builder"

  export let node: AppNavigationLink
  export let depth: number = 0
  export let bindings: EnrichedBinding[] = []
  export let onChange: (field: string, value: unknown) => void
  // Access of the parent group; a sub link must be at least as restrictive.
  export let parentRole: string | null = null

  const actionOptions = [
    { label: "Hide link", value: "hide" },
    { label: "Show link", value: "show" },
  ]
  const typeOptions = [
    { label: "Inline link", value: "link" },
    { label: "Open sub links", value: "sublinks" },
  ]

  $: urlOptions = screenStore.routes
  $: isGroup = node.type === "sublinks"
  // A node can only become / stay a group while its children stay within depth.
  $: canNest = NavigationUtils.canNavNest(depth)

  // A sub link must be at least as restrictive as its parent group, so a user
  // can never reach a child whose parent they cannot see. Roles form an
  // inheritance graph (custom roles are separate branches, not a linear ladder),
  // so this is a graph-reachability question, not a priority comparison.
  $: allowedRoles = parentRole
    ? RoleUtils.getRolesAtLeastAsRestrictive(parentRole, $roles)
    : null

  // What the item is actually gated by, for display only - never written back,
  // so opening an item can never change the app. An item without its own role
  // inherits its parent's at runtime (top level defaults to Basic), and a
  // stored role that the min-role rule no longer allows (e.g. authored before
  // the rule, or left behind after its parent was restricted) falls back to
  // the parent's role, which is what the runtime effectively enforces.
  $: effectiveRole =
    node.roleId && (!allowedRoles || allowedRoles.includes(node.roleId))
      ? node.roleId
      : parentRole || Constants.Roles.BASIC
</script>

<div class="fields">
  {#if canNest}
    <PropertyControl
      label="Nav item"
      control={RadioGroup}
      value={node.type || "link"}
      onChange={(value: unknown) => onChange("type", value)}
      props={{ options: typeOptions }}
    />
  {/if}
  <PropertyControl
    label="Label"
    control={DrawerBindableInput}
    value={node.text}
    onChange={(value: unknown) => onChange("text", value)}
    {bindings}
    props={{ updateOnChange: false }}
    on:drawerShow
    on:drawerHide
  />
  <PropertyControl
    label="Icon"
    control={PhosphorIconPicker}
    value={node.icon}
    onChange={(value: unknown) => onChange("icon", value)}
    {bindings}
    props={{ updateOnChange: false }}
    on:drawerShow
    on:drawerHide
  />
  <PropertyControl
    label={isGroup ? "Link (optional)" : "Link"}
    control={DrawerBindableCombobox}
    value={node.url}
    onChange={(value: unknown) => onChange("url", value)}
    {bindings}
    props={{
      options: $urlOptions,
      appendBindingsAsOptions: false,
      placeholder: null,
    }}
    on:drawerShow
    on:drawerHide
  />
  <PropertyControl
    label="Access"
    control={RoleSelect}
    value={effectiveRole}
    onChange={(value: unknown) => onChange("roleId", value)}
    props={{ allowedRoles }}
  />
  <!-- Custom CSS styles this item's own row (the anchor for links, the
       header row for groups), at any depth -->
  <CustomStylesSection
    componentInstance={node}
    componentDefinition={null}
    iconTooltip="Navigation item"
    componentTitle={node.text}
    onSave={async (value: unknown) => onChange("_styles", { custom: value })}
    on:drawerShow
    on:drawerHide
  />
  <ConditionalUISection
    componentInstance={node}
    componentDefinition={null}
    {bindings}
    componentBindings={[]}
    {actionOptions}
    onSave={async (value: unknown) => onChange("_conditions", value)}
    on:drawerShow
    on:drawerHide
  />
</div>

<style>
  .fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
</style>
