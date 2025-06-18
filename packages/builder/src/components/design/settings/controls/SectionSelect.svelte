<script>
  import { Select } from "@budibase/bbui"

  export let value = ""
</script>

<Select
  {value}
  on:change
  options={[
    {
      label: "Main with sidebar",
      value: "mainSidebar",
    },
    {
      label: "Sidebar with main",
      value: "sidebarMain",
    },
    {
      label: "One column",
      value: "oneColumn",
    },
    {
      label: "Two columns",
      value: "twoColumns",
    },
    {
      label: "Three columns",
      value: "threeColumns",
    },
  ]}
/>
