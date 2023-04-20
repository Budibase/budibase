<script>
  import {
    Divider,
    Heading,
    ActionButton,
    Badge,
    Body,
    Layout,
  } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import RestAuthenticationBuilder from "./auth/RestAuthenticationBuilder.svelte"
  import ViewDynamicVariables from "./variables/ViewDynamicVariables.svelte"
  import {
    getRestBindings,
    getEnvironmentBindings,
    readableToRuntimeBinding,
    runtimeToReadableMap,
  } from "builderStore/dataBinding"
  import { cloneDeep } from "lodash/fp"
  import { licensing } from "stores/portal"
  import { _ } from "../../../../../../lang/i18n"

  export let datasource
  export let queries

  let addHeader

  let parsedHeaders = runtimeToReadableMap(
    getRestBindings(),
    cloneDeep(datasource?.config?.defaultHeaders)
  )

  const onDefaultHeaderUpdate = headers => {
    const flatHeaders = cloneDeep(headers).reduce((acc, entry) => {
      acc[entry.name] = readableToRuntimeBinding(getRestBindings(), entry.value)
      return acc
    }, {})

    datasource.config.defaultHeaders = flatHeaders
  }
</script>

<Divider />
<div class="section-header">
  <div class="badge">
    <Heading size="S"
      >{$_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Headers"
      )}</Heading
    >
    <Badge quiet grey
      >{$_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Optional"
      )}</Badge
    >
  </div>
</div>
<Body size="S">
  {$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Headers_enable"
  )}
</Body>
<KeyValueBuilder
  bind:this={addHeader}
  bind:object={parsedHeaders}
  on:change={evt => onDefaultHeaderUpdate(evt.detail)}
  noAddButton
  bindings={getRestBindings()}
/>
<div>
  <ActionButton icon="Add" on:click={() => addHeader.addEntry()}>
    {$_(
      "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Add_header"
    )}
  </ActionButton>
</div>

<Divider />
<div class="section-header">
  <div class="badge">
    <Heading size="S"
      >{$_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Authentication"
      )}</Heading
    >
    <Badge quiet grey
      >{$_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Create_authentication"
      )}</Badge
    >
  </div>
</div>
<Body size="S">
  {$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Create_authentication"
  )}
</Body>
<RestAuthenticationBuilder bind:configs={datasource.config.authConfigs} />

<Divider />
<div class="section-header">
  <div class="badge">
    <Heading size="S"
      >{$_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Variables"
      )}</Heading
    >
    <Badge quiet grey
      >{$_(
        "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Optional"
      )}</Badge
    >
  </div>
</div>
<Body size="S"
  >{$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Variables_enable"
  )}</Body
>
<Heading size="XS"
  >{$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Static"
  )}</Heading
>
<Layout noPadding gap="XS">
  <KeyValueBuilder
    name={$_(
      "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Variable"
    )}
    keyPlaceholder={$_(
      "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Name"
    )}
    headings
    bind:object={datasource.config.staticVariables}
    on:change
    bindings={$licensing.environmentVariablesEnabled
      ? getEnvironmentBindings()
      : []}
  />
</Layout>
<div />
<Heading size="XS"
  >{$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Dynamic"
  )}</Heading
>
<Body size="S">
  {$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.RestExtraConfigForm.Dynamic variables are evaluated when a dependant query is executed. The value is cached for a period of time and will be refreshed if a query fails"
  )}
</Body>
<ViewDynamicVariables {queries} {datasource} />

<style>
  .section-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .badge {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
