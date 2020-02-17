<script>
  import { onMount, setContext } from "svelte"
  import { MDCDataTable } from "@material/data-table"
  import DatatableRow from "./DatatableRow.svelte"
  import DatatableCell from "./DatatableCell.svelte"
  import ClassBuilder from "../ClassBuilder.js"

  const cb = new ClassBuilder("data-table")
  setContext("BBMD:data-table:cb", cb)

  let datatable = null
  let instance = null

  onMount(() => {
    if (!!datatable) instance = new MDCDataTable(datatable)
    return () => {
      !!instance && instance.destroy()
      instance = null
    }
  })
</script>

<div class={cb.block()}>
  <table class={cb.elem`table`} aria-label="Material Design Datatable">
    <thead>
      <DatatableRow isHeader>
        <DatatableCell isHeader>Id</DatatableCell>
        <DatatableCell isHeader>First Name</DatatableCell>
        <DatatableCell isHeader>Second Name</DatatableCell>
        <DatatableCell isHeader>Gender</DatatableCell>
        <DatatableCell isHeader>Address</DatatableCell>
      </DatatableRow>
    </thead>
    <tbody class={cb.elem`content`}>
      <DatatableRow>
        <DatatableCell numeric>123456</DatatableCell>
        <DatatableCell>Conor</DatatableCell>
        <DatatableCell>McKeown</DatatableCell>
        <DatatableCell>Male</DatatableCell>
        <DatatableCell>1 Cool Street</DatatableCell>
      </DatatableRow>
    </tbody>
  </table>
</div>
