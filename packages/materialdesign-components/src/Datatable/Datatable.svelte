<script>
  import { onMount, setContext } from "svelte"
  import { MDCDataTable } from "@material/data-table"
  import Row from "./DatatableRow.svelte"
  import Cell from "./DatatableCell.svelte"
  import { Button } from "../Button"
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

<div bind:this={datatable} class={cb.build()}>
  <table class={cb.elem`table`} aria-label="Material Design Datatable">
    <thead>
      <Row isHeader>
        <Cell isHeader>Id</Cell>
        <Cell isHeader>First Name</Cell>
        <Cell isHeader>Second Name</Cell>
        <Cell isHeader>Gender</Cell>
        <Cell isHeader>Address</Cell>
        <Cell isHeader>Actions</Cell>
      </Row>
    </thead>
    <tbody class={cb.elem`content`}>
      <Row>
        <Cell>123456</Cell>
        <Cell>Conor</Cell>
        <Cell>McKeown</Cell>
        <Cell>Male</Cell>
        <Cell>1 Cool Street</Cell>
        <Cell>
          <Button
            text="Select"
            variant="unelevated"
            colour="secondary"
            size="small" />
        </Cell>
      </Row>
      <Row>
        <Cell>789101</Cell>
        <Cell>Joe</Cell>
        <Cell>Bloggs</Cell>
        <Cell>Male</Cell>
        <Cell>2 Cool Street</Cell>
        <Cell>
          <Button
            text="Select"
            variant="unelevated"
            colour="secondary"
            size="small" />
        </Cell>
      </Row>
    </tbody>
  </table>
</div>
