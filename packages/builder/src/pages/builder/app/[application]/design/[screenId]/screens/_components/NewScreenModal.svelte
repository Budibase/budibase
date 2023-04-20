<script>
  import { tables } from "stores/backend"
  import { ModalContent, Body, Layout, Icon, Heading } from "@budibase/bbui"
  import blankScreenPreview from "./blankScreenPreview.png"
  import listScreenPreview from "./listScreenPreview.png"

  import { _ } from "../../../../../../../../../lang/i18n"

  export let onConfirm
  export let onCancel

  let listScreenModeKey = "autoCreate"
  let blankScreenModeKey = "blankScreen"

  let selectedScreenMode

  const confirmScreenSelection = async () => {
    await onConfirm(selectedScreenMode)
  }
</script>

<div>
  <ModalContent
    title={$_(
      "pages.builder.app.application.design.screenId.screens._components.NewScreenModal.Add_screens"
    )}
    confirmText={$_(
      "pages.builder.app.application.design.screenId.screens._components.NewScreenModal.Continue"
    )}
    cancelText={$_(
      "pages.builder.app.application.design.screenId.screens._components.NewScreenModal.Cancel"
    )}
    onConfirm={confirmScreenSelection}
    {onCancel}
    disabled={!selectedScreenMode}
    size="M"
  >
    <Layout noPadding gap="S">
      <div
        class="screen-type item blankView"
        class:selected={selectedScreenMode == blankScreenModeKey}
        on:click={() => {
          selectedScreenMode = blankScreenModeKey
        }}
      >
        <div class="content screen-type-wrap">
          <img
            alt="blank screen preview"
            class="preview"
            src={blankScreenPreview}
          />
          <div class="screen-type-text">
            <Heading size="XS"
              >{$_(
                "pages.builder.app.application.design.screenId.screens._components.NewScreenModal.Blank_screen"
              )}</Heading
            >
            <Body size="S"
              >{$_(
                "pages.builder.app.application.design.screenId.screens._components.NewScreenModal.Add_blank"
              )}</Body
            >
          </div>
        </div>
        <div
          style="color: var(--spectrum-global-color-green-600); float: right"
        >
          <div
            class={`checkmark-spacing ${
              selectedScreenMode == blankScreenModeKey ? "visible" : ""
            }`}
          >
            <Icon size="S" name="CheckmarkCircle" />
          </div>
        </div>
      </div>

      <div class="listViewTitle">
        <Heading size="XS"
          >{$_(
            "pages.builder.app.application.design.screenId.screens._components.NewScreenModal.Quickly_create"
          )}</Heading
        >
      </div>

      <div
        class="screen-type item"
        class:selected={selectedScreenMode == listScreenModeKey}
        on:click={() => {
          selectedScreenMode = listScreenModeKey
        }}
        class:disabled={!$tables.list.filter(table => table._id !== "ta_users")
          .length}
      >
        <div class="content screen-type-wrap">
          <img
            alt="list screen preview"
            class="preview"
            src={listScreenPreview}
          />
          <div class="screen-type-text">
            <Heading size="XS"
              >{$_(
                "pages.builder.app.application.design.screenId.screens._components.NewScreenModal.List_view"
              )}</Heading
            >
            <Body size="S">
              {$_(
                "pages.builder.app.application.design.screenId.screens._components.NewScreenModal.Create"
              )}
            </Body>
          </div>
        </div>
        <div
          style="color: var(--spectrum-global-color-green-600); float: right"
        >
          <div
            class={`checkmark-spacing ${
              selectedScreenMode == listScreenModeKey ? "visible" : ""
            }`}
          >
            <Icon size="S" name="CheckmarkCircle" />
          </div>
        </div>
      </div>
    </Layout>
  </ModalContent>
</div>

<style>
  .screen-type-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  .checkmark-spacing {
    margin-right: var(--spacing-m);
    opacity: 0;
  }
  .content {
    letter-spacing: 0px;
  }
  .item {
    cursor: pointer;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    border-width: 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item:hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .screen-type-wrap .screen-type-text {
    padding-left: var(--spectrum-alias-item-padding-xl);
  }
  .screen-type-wrap .screen-type-text :global(h1) {
    padding-bottom: var(--spacing-xs);
  }
  .screen-type-wrap :global(.spectrum-Icon) {
    min-width: var(--spectrum-icon-size-m);
  }
  .screen-type-wrap :global(.spectrum-Heading) {
    padding-bottom: var(--spectrum-alias-item-padding-s);
  }
  .preview {
    width: 140px;
  }

  .listViewTitle {
    margin-top: 35px;
  }

  .blankView {
    margin-top: 10px;
  }

  .visible {
    opacity: 1;
  }
</style>
