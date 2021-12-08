<script>
  import { Heading, Layout, Icon } from "@budibase/bbui"

  export let onSelect
</script>

<Layout gap="XS" noPadding>
  <div class="template start-from-scratch" on:click={() => onSelect(null)}>
    <div
      class="background-icon"
      style={`background: rgb(50, 50, 50); color: white;`}
    >
      <Icon name="Add" />
    </div>
    <Heading size="XS">Start from scratch</Heading>
    <p class="detail">BLANK</p>
  </div>
  <div
    class="template import"
    on:click={() => onSelect(null, { useImport: true })}
  >
    <div
      class="background-icon"
      style={`background: rgb(50, 50, 50); color: white;`}
    >
      <Icon name="Add" />
    </div>
    <Heading size="XS">Import an app</Heading>
    <p class="detail">BLANK</p>
  </div>
</Layout>

<style>
  .background-icon {
    padding: 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    color: white;
  }

  .template {
    min-height: 60px;
    display: grid;
    grid-gap: var(--layout-s);
    grid-template-columns: auto 1fr auto;
    border: 1px solid #494949;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    background: var(--background-alt);
    padding: 8px 16px;
  }

  .detail {
    text-align: right;
  }

  .start-from-scratch {
    background: var(--spectrum-global-color-gray-50);
    margin-top: 20px;
  }

  .import {
    background: var(--spectrum-global-color-gray-50);
  }
</style>
