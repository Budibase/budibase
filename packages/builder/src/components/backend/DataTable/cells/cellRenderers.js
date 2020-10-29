import AttachmentList from "./AttachmentCell.svelte"
import EditRow from "../modals/EditRow.svelte"
import DeleteRow from "../modals/DeleteRow.svelte"
import RelationshipDisplay from "./RelationshipCell.svelte"

const renderers = {
  attachment: attachmentRenderer,
  link: linkedRowRenderer,
}

export function getRenderer(schema, editable) {
  if (renderers[schema.type]) {
    return renderers[schema.type](schema.options, schema.constraints, editable)
  } else {
    return false
  }
}

export function deleteRowRenderer(params) {
  const container = document.createElement("div")

  new DeleteRow({
    target: container,
    props: {
      row: params.data,
    },
  })

  return container
}

export function editRowRenderer(params) {
  const container = document.createElement("div")
  container.style.height = "100%"
  container.style.display = "flex"
  container.style.alignItems = "center"

  new EditRow({
    target: container,
    props: {
      row: params.data,
    },
  })

  return container
}

/* eslint-disable no-unused-vars */
function attachmentRenderer(options, constraints, editable) {
  return params => {
    const container = document.createElement("div")
    container.style.height = "100%"
    container.style.display = "flex"
    container.style.alignItems = "center"

    const attachmentInstance = new AttachmentList({
      target: container,
      props: {
        files: params.value || [],
      },
    })

    return container
  }
}

/* eslint-disable no-unused-vars */
function linkedRowRenderer() {
  return params => {
    let container = document.createElement("div")
    container.style.display = "grid"
    container.style.height = "100%"
    container.style.alignItems = "center"

    new RelationshipDisplay({
      target: container,
      props: {
        row: params.data,
        columnName: params.column.colId,
        selectRelationship: params.selectRelationship,
      },
    })

    return container
  }
}
