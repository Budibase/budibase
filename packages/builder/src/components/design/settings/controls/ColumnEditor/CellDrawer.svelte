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
      <div class="row">
        <div class="field-section">
          <Input
            bind:value={column.width}
            label="Width (include unit % or px)"
            placeholder="Auto"
          />
        </div>
        <div class="field-section">
          <Select
            label="Alignment"
            bind:value={column.align}
            options={["Left", "Center", "Right"]}
            placeholder="Default"
          />
        </div>
      </div>
      <div class="row">
        <div class="field-section">
          <DrawerBindableInput
            title="Format Value"
            label="Format Value"
            value={column.template}
            on:change={e => (column.template = e.detail)}
            placeholder={`{{ Value }}`}
            bindings={[
              {
                readableBinding: "Value",
                runtimeBinding: "[value]",
                category: `Column: ${column.name}`,
                icon: "table",
              },
            ]}
            context={{
              value: columnValue,
            }}
          />
        </div>
        <div class="field-section">
          <DrawerBindableInput
            title="Default Value"
            label="Default Value"
            value={column.defaultValue}
            on:change={e => (column.defaultValue = e.detail)}
            bindings={[
              {
                readableBinding: "Default Value",
                runtimeBinding: "[defaultValue]",
                category: `Column: ${column.name}`,
                icon: "table",
              },
            ]}
            context={{
              value: columnValue,
            }}
          />
        </div>
      </div>
      <div class="row">
        <div class="field-section">
          <Layout noPadding gap="XS" class="color-section">
            <Label>Background color</Label>
            <ColorPicker
              value={column.background}
              on:change={e => (column.background = e.detail)}
              spectrumTheme={$themeStore.theme}
            />
          </Layout>
        </div>
        <div class="field-section">
          <Layout noPadding gap="XS" class="color-section">
            <Label>Text color</Label>
            <ColorPicker
              value={column.color}
              on:change={e => (column.color = e.detail)}
              spectrumTheme={$themeStore.theme}
            />
          </Layout>
        </div>
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
  }

  .row {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .field-section {
    flex: 1;
  }

  .info {
    font-size: var(--font-size-s);
    color: var(--color-text-secondary);
  }
</style>
