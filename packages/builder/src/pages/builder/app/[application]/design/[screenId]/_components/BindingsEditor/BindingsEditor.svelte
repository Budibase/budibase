<script>
  import { Icon, Heading, Button } from "@budibase/bbui"
  import {
    selectedScreen, store,
  } from "builderStore"
  import {
    EditorModes,
  } from "components/common/CodeEditor"
  import CodeEditor from "components/common/CodeEditor/CodeEditor.svelte"
  import {
    decodeJSBinding,
    encodeJSBinding,
  } from "@budibase/string-templates"
  import {
    getBindableProperties,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"

  $: runtimeBindings = []
  $: readableBindings = []
  $: bindableProperties = getBindableProperties(
    $selectedScreen,
    $store.selectedComponentId
  )
  $: selectedFilter = "all"

  const getComponentIcon = component => {
    const def = store.actions.components.getDefinition(component?._component)
    return def?.icon
  }

  function extractBindings(obj) {
    let results = [];

    function recursiveSearch(subObj, parent) {
      for (let key in subObj) {
        if (typeof subObj[key] === 'object' && subObj[key] !== null) {
          // don't pass arrays as parent, use one level up
          const nextParent = Array.isArray(subObj) ? parent : subObj;
          // Recurse into the object
          recursiveSearch(subObj[key], nextParent);
        } else if (typeof subObj[key] === 'string' && subObj[key].startsWith("{{ ")) {
          // Found a match, store the relevant information
          let type = "hbs"
          if (subObj[key].startsWith("{{ js")) {
            type = "js"
          }
          let filter = ""
          let instanceName = subObj._instanceName
          let icon = ""

          if (subObj._component) {
            filter = "components"
            icon = getComponentIcon(subObj)
          }

          // try to determine condition
          if (instanceName === undefined) {
            if (parent._conditions && subObj.action) {
              filter = "conditions"
              instanceName = `Condition: ${subObj.action} | Setting: ${subObj.setting} | Value: ${subObj.settingValue} | Operator: ${subObj.operator} > Parent: ${parent._instanceName}`
            }
          }

          if (!filter) {
            filter = "actions"
          }

          results.push({
            filter,
            _instanceName: instanceName,
            type,
            icon,
            value: subObj[key]
          });
        }
      }
    }
    recursiveSearch(obj);
    return results;
  }

  $: {
    runtimeBindings = extractBindings($selectedScreen).filter(b => b.type === "js")
    readableBindings = runtimeBindings.map(b => {
      return {
        ...b,
        value: decodeJSBinding(runtimeToReadableBinding(bindableProperties, b.value))
      }
    })

    if (selectedFilter !== "all") {
      readableBindings = readableBindings.filter(b => b.filter === selectedFilter)
    }
  }

  const onChangeHBSValue = e => {
    const hbsValue = e.detail
    // updateValue(hbsValue)
  }

  const onChangeJSValue = e => {
    const jsValue = encodeJSBinding(e.detail)
    // updateValue(jsValue)
  }

</script>

<div class="container">

  <div class="buttons">
    <div class="button">
      <Button cta={selectedFilter === "all"} secondary={selectedFilter !== "all"} on:click={() => { selectedFilter = "all"}}>All</Button>
    </div>
    <div class="button">
      <Button cta={selectedFilter === "components"} secondary={selectedFilter !== "components"} on:click={() => { selectedFilter = "components"}}>Components</Button>
    </div>
    <div class="button">
      <Button cta={selectedFilter === "conditions"} secondary={selectedFilter !== "conditions"} on:click={() => { selectedFilter = "conditions"}}>Conditions</Button>
    </div>
    <div class="button">
      <Button cta={selectedFilter === "actions"} secondary={selectedFilter !== "actions"} on:click={() => { selectedFilter = "actions"}}>Actions</Button>
    </div>
  </div>

  {#each readableBindings as binding}
    <div class="editor">
      <div class="name">
        <div class="icon">
          <Icon size="S" name={binding.icon} />
        </div>
        <Heading size="XS" weight="light">{binding._instanceName}</Heading>
      </div>
      {#if binding.type === "js"}
        <CodeEditor
          value={binding.value}
          on:change={onChangeJSValue}
          completions={[]}
          mode={EditorModes.JS}
          autocompleteEnabled={true}
          height="100%"
        />
      {:else}
        <CodeEditor
          value={binding.value}
          on:change={onChangeHBSValue}
          completions={[]}
          mode={EditorModes.Handlebars}
          autocompleteEnabled={true}
          height="100%"
        />
      {/if}
    </div>
  {/each}
</div>

<style>
    .buttons {
        display: flex;
        width: 100%;
        justify-content: center;
    }
    .button {
        margin-right: 10px;
    }
    .editor {
        margin-bottom: 20px;
    }
    .icon {
        margin-top: 3px;
        margin-right: 5px;
    }
    .name {
        margin-bottom: 5px;
        display: flex;
    }
    .container {
      padding-left: 20px;
      padding-right: 20px;
    }

</style>
