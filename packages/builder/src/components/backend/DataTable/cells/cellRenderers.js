import AttachmentList from "./AttachmentCell.svelte"
import EditRowPopover from "../popovers/RowPopover.svelte"
import RelationshipDisplay from "./RelationshipCell.svelte"
// import BooleanCell from "./BooleanCell.svelte"

const renderers = {
  attachment: attachmentRenderer,
  link: linkedRowRenderer,
  boolean: booleanRenderer,
}

export function getRenderer(schema, editable) {
  if (renderers[schema.type]) {
    return renderers[schema.type](schema.options, schema.constraints, editable)
  } else {
    return false
  }
}

export function editRowRenderer(params) {
  const container = document.createElement("div")

  new EditRowPopover({
    target: container,
    props: {
      row: params.data,
    },
  })

  return container
}

/* eslint-disable no-unused-vars */
function booleanRenderer(options, constraints) {
  return params => {
    let container = document.createElement("input")

    // TODO: implement

    return container

    // const toggle = e => {
    //   params.value = !params.value
    //   params.setValue(e.currentTarget.checked)
    // }
    // let input = document.createElement("input")
    // input.style.display = "grid"
    // input.style.placeItems = "center"
    // input.style.height = "100%"
    // input.type = "checkbox"
    // input.checked = params.value
    // if (editable) {
    //   input.addEventListener("click", toggle)
    // } else {
    //   input.disabled = true
    // }
    // return input
  }
}

/* eslint-disable no-unused-vars */
function attachmentRenderer(options, constraints, editable) {
  return params => {
    const container = document.createElement("div")

    const attachmentInstance = new AttachmentList({
      target: container,
      props: {
        files: params.value || [],
      },
    })

    // const deleteFile = event => {
    //   const newFilesArray = params.value.filter(file => file !== event.detail)
    //   params.setValue(newFilesArray)
    // }

    // attachmentInstance.$on("delete", deleteFile)

    return container
  }
}

/* eslint-disable no-unused-vars */
function linkedRowRenderer(options, constraints, editable) {
  return params => {
    let container = document.createElement("div")
    container.style.display = "grid"
    container.style.placeItems = "center"
    container.style.height = "100%"

    new RelationshipDisplay({
      target: container,
      props: {
        row: params.data,
        columnName: params.column.colId,
      },
    })

    return container
  }
}
