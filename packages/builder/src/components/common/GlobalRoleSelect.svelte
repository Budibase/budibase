<script lang="ts">
  import { Select } from "@budibase/bbui"

  interface GlobalRoleOption {
    label: string
    value: string
    subtitle?: string
  }

  export let value: string | undefined = undefined
  export let options: GlobalRoleOption[] = []
  export let label = "Select role"
  export let disabled = false
</script>

<div class="role-select">
  <Select
    {label}
    placeholder={false}
    popoverClass="global-role-select-popover"
    wrapText
    bind:value
    {options}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    getOptionSubtitle={option => option.subtitle}
    showSelectedSubtitle={true}
    {disabled}
  />
</div>

<style>
  .role-select :global(.spectrum-Picker) {
    height: auto;
    align-items: center;
    padding-top: var(--spacing-m);
    padding-bottom: var(--spacing-m);
  }
  .role-select :global(.spectrum-Picker-label.has-subtitle .picker-label-text),
  .role-select :global(.spectrum-Picker-label .picker-label-subtitle) {
    font-size: 14px;
    line-height: 18px;
  }
  :global(.global-role-select-popover .spectrum-Menu-itemLabel),
  :global(.global-role-select-popover .subtitle-text) {
    font-size: 14px;
    line-height: 18px;
  }
</style>
