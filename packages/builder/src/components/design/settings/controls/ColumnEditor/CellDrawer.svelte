<script>
  import {
    Input,
    Select,
    ColorPicker,
    DrawerContent,
    Layout,
    Label,
  } from "@budibase/bbui"
  import { themeStore, previewStore } from "@/stores/builder"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  export let column

  $: columnValue =
    $previewStore.selectedComponentContext?.eventContext?.row?.[column.name]
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding gap="S">
      <Input
        bind:value={column.width}
        label="Width (must include a unit like px or %)"
        placeholder="Auto"
      />
      <Select
        label="Alignment"
        bind:value={column.align}
        options={["Left", "Center", "Right"]}
        placeholder="Default"
      />
      <DrawerBindableInput
        title="Value"
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
        context={{
          value: columnValue,
        }}
      />
      <Layout noPadding gap="XS">
        <Label>Background color</Label>
        <ColorPicker
          value={column.background}
          on:change={e => (column.background = e.detail)}
          spectrumTheme={$themeStore.theme}
        />
      </Layout>
      <Layout noPadding gap="XS">
        <Label>Text color</Label>
        <ColorPicker
          value={column.color}
          on:change={e => (column.color = e.detail)}
          spectrumTheme={$themeStore.theme}
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
