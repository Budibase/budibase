<script>
  import { _ } from "../../../../../../lang/i18n"
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
      <Input
        bind:value={column.width}
        label={$_(
          "components.design.settings.controls.ColumnEditor.BasicColumnEditor.Width"
        )}
        placeholder={$_(
          "components.design.settings.controls.ColumnEditor.BasicColumnEditor.Auto"
        )}
      />
      <Select
        label={$_(
          "components.design.settings.controls.ColumnEditor.BasicColumnEditor.Aligment"
        )}
        bind:value={column.align}
        options={[
          $_(
            "components.design.settings.controls.ColumnEditor.BasicColumnEditor.Left"
          ),
          $_(
            "components.design.settings.controls.ColumnEditor.BasicColumnEditor.Center"
          ),
          $_(
            "components.design.settings.controls.ColumnEditor.BasicColumnEditor.Right"
          ),
        ]}
        placeholder={$_(
          "components.design.settings.controls.ColumnEditor.BasicColumnEditor.Default"
        )}
      />
      <DrawerBindableInput
        label={$_(
          "components.design.settings.controls.ColumnEditor.CellDrawer.Value"
        )}
        value={column.template}
        on:change={e => (column.template = e.detail)}
        placeholder={`{{ Value }}`}
        bindings={[
          {
            readableBinding: $_(
              "components.design.settings.controls.ColumnEditor.CellDrawer.Value"
            ),
            runtimeBinding: "[value]",
            category: `${$_(
              "components.design.settings.controls.ColumnEditor.CellDrawer.Column"
            )}: ${column.name}`,
            icon: "TableColumnMerge",
          },
        ]}
      />
      <Layout noPadding gap="XS">
        <Label
          >{$_(
            "components.design.settings.controls.ColumnEditor.CellDrawer.Background_color"
          )}</Label
        >
        <ColorPicker
          value={column.background}
          on:change={e => (column.background = e.detail)}
          alignRight
          spectrumTheme={$store.theme}
        />
      </Layout>
      <Layout noPadding gap="XS">
        <Label
          >{$_(
            "components.design.settings.controls.ColumnEditor.CellDrawer.Text_color"
          )}</Label
        >
        <ColorPicker
          value={column.color}
          on:change={e => (column.color = e.detail)}
          alignRight
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
