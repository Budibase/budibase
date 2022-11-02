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
  import { LuceneUtils } from "@budibase/frontend-core"

  export let column
  // export let conditions = {
  //   background: null,
  //   color: null,
  // }

  const getOperatorOptions = () => {
    return LuceneUtils.getValidOperatorsForType("string")
  }
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
    </Layout>
  </div>
  <Layout noPadding>
    <div class="conditions">
      <div class="condition">
        <div>
          <Label>Background color</Label>
          <div class="color-setting">
            <ColorPicker
              value={column.background}
              on:change={e => (column.background = e.detail)}
              alignRight
              spectrumTheme={$store.theme}
            />
          </div>
        </div>
        <div>IF VALUE</div>
        <Select placeholder={null} options={getOperatorOptions()} />
        <div>
          <DrawerBindableInput placeholder="Expression" />
        </div>
      </div>
      <div class="condition">
        <div>
          <Label>Text color</Label>
          <div class="color-setting">
            <ColorPicker
              value={column.color}
              on:change={e => (column.color = e.detail)}
              alignRight
              spectrumTheme={$store.theme}
            />
          </div>
        </div>
        <div>IF VALUE</div>
        <Select placeholder={null} options={getOperatorOptions()} />
        <div>
          <DrawerBindableInput placeholder="Expression" />
        </div>
      </div>
    </div>
  </Layout>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 240px;
  }
  .conditions {
    width: 100%;
    max-width: 700px;
    gap: var(--spacing-m);
  }
  .condition {
    margin-top: 32px;
    gap: var(--spacing-l);
    display: grid;
    align-items: center;
    grid-template-columns: 120px 80px 160px auto;
    border-radius: var(--border-radius-s);
  }
  .color-setting {
    padding-top: 8px;
  }
</style>
