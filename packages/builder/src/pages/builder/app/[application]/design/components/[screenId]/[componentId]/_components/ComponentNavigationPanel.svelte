<script>
  import NavigationPanel from "components/design/NavigationPanel/NavigationPanel.svelte"
  import { goto } from "@roxi/routify"
  import { Layout, Search } from "@budibase/bbui"

  let searchString
</script>

<NavigationPanel
  title="Components"
  showAddButton
  onClickAddButton={() => $goto("./new")}
>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Search
      placeholder="Search"
      value={searchString}
      on:change={e => (searchString = e.detail)}
    />
  </Layout>
</NavigationPanel>
