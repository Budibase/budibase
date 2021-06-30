<script>
  import { Select } from "@budibase/bbui"
  import { store } from "builderStore"

  const themeOptions = [
    {
      label: "Lightest",
      value: "spectrum--lightest",
    },
    {
      label: "Light",
      value: "spectrum--light",
    },
    {
      label: "Dark",
      value: "spectrum--dark",
    },
    {
      label: "Darkest",
      value: "spectrum--darkest",
    },
  ]
</script>

<div>
  <Select
    value={$store.theme || "spectrum--light"}
    options={themeOptions}
    placeholder={null}
    on:change={e => store.actions.theme.save(e.detail)}
  />
</div>

<style>
  div {
    padding-right: 8px;
  }
</style>
