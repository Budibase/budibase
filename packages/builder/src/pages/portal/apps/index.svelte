<script>
  import { Heading, Layout } from "@budibase/bbui"
</script>

<Layout noPadding>
  <div>
    <Heading>Apps</Heading>
  </div>
  <div class="appList">
    {#each new Array(10) as _}
      <div class="app" />
    {/each}
  </div>
</Layout>

<style>
  .appList {
    display: grid;
    grid-gap: 50px;
    grid-template-columns: repeat(auto-fill, 300px);
  }
  .app {
    height: 130px;
    border-radius: 4px;
    background-color: var(--spectrum-global-color-gray-200);
  }
</style>
