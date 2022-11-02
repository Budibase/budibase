<script>
  import {
    Input,
    Select,
    ColorPicker,
    DrawerContent,
    Layout,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { LuceneUtils } from "@budibase/frontend-core"

  export let column

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
  <br />
  <Layout noPadding>
    <div class="conditions">
      <div class="condition">
        <div>IF VALUE</div>
        <Select
          bind:value={column.conditions.background.operator}
          placeholder={null}
          options={getOperatorOptions()}
        />
        <div>
          <DrawerBindableInput
            placeholder="Expression"
            value={column.conditions.background.referenceValue}
            on:change={e =>
              (column.conditions.background.referenceValue = e.detail)}
          />
        </div>
        <div>SET <b>Background color</b></div>
        <ColorPicker
          value={column.background}
          on:change={e => (column.background = e.detail)}
          alignRight
          spectrumTheme={$store.theme}
        />
      </div>
      <div class="condition">
        <div>IF VALUE</div>
        <Select
          bind:value={column.conditions.color.operator}
          placeholder={null}
          options={getOperatorOptions()}
        />
        <div>
          <DrawerBindableInput
            placeholder="Expression"
            value={column.conditions.color.referenceValue}
            on:change={e => (column.conditions.color.referenceValue = e.detail)}
          />
        </div>
        <div>SET <b>Text color</b></div>
        <ColorPicker
          value={column.color}
          on:change={e => (column.color = e.detail)}
          alignRight
          spectrumTheme={$store.theme}
        />
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
    padding-bottom: 300px;
  }
  .condition {
    margin-top: 32px;
    gap: var(--spacing-l);
    display: grid;
    align-items: center;
    grid-template-columns: 160px 160px auto;
    border-radius: var(--border-radius-s);
  }
</style>
