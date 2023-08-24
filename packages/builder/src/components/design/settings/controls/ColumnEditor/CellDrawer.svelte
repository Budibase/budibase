<script>
  import {
    Input,
    Select,
    ColorPicker,
    DrawerContent,
    Layout,
    Label,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let column
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding gap="S">
      <Input bind:value={column.width} label="Width" placeholder="Auto" />
      <Select
        label="Alignment"
        bind:value={column.align}
        options={["Left", "Center", "Right"]}
        placeholder="Default"
      />
      <DrawerBindableInput
        label="Value"
        value={column.template}
        on:change={e => (column.template = e.detail)}
        placeholder={`{{ Value }}`}
        bindings={[
          {
            readableBinding: "Value",
            runtimeBinding: "[value]",
            category: `Column: ${column.name}`,
            icon: "TableColumnMerge",
          },
        ]}
      />
      <Layout noPadding gap="XS">
        <Label>Background color</Label>
        <ColorPicker
          value={column.background}
          on:change={e => (column.background = e.detail)}
          spectrumTheme={$store.theme}
        />
      </Layout>
      <Layout noPadding gap="XS">
        <Label>Text color</Label>
        <ColorPicker
          value={column.color}
          on:change={e => (column.color = e.detail)}
          spectrumTheme={$store.theme}
        />
      </Layout>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
