<script>
  import { onMount, setContext } from "svelte"
  import { MDCDataTable } from "@material/data-table"
  import Row from "./DatatableRow.svelte"
  import Cell from "./DatatableCell.svelte"
  import { Button } from "../Button"
  import ClassBuilder from "../ClassBuilder.js"

  export let _bb

  const cb = new ClassBuilder("data-table")
  setContext("BBMD:data-table:cb", cb)

  let datatable = null
  let instance = null
  let tableElement
  let initialied = false

  $: {
    if(tableElement && datatable && !initialied) {
      const children = _bb.attachChildren(tableElement)
      if(children.length > 0) {
        instance = new MDCDataTable(datatable)
        initialied = true
      }
    }
  }

  onMount(() => {
    return () => {
      !!instance && instance.destroy()
      instance = null
    }
  })
</script>

<div bind:this={datatable} class={cb.build()}>
  <table class={cb.elem`table`} aria-label="Material Design Datatable" bind:this={tableElement}>
    
  </table>
</div>
