<script lang="ts">
  import { Select } from "@budibase/bbui"

  interface GlobalRoleOption {
    label: string
    value: string
    subtitle?: string
  }

  interface Props {
    value?: string
    options?: GlobalRoleOption[]
    label?: string
    size?: "S" | "M" | "L"
    disabled?: boolean
  }

  let {
    value = $bindable(),
    options = [],
    label = "Select role",
    size = "M",
    disabled = false,
  }: Props = $props()
</script>

<div class="role-select">
  <Select
    {label}
    {size}
    placeholder={false}
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
</style>
