import AttachmentList from "./AttachmentCell.svelte"
import EditRow from "../modals/EditRow.svelte"
import CreateEditUser from "../modals/CreateEditUser.svelte"
import DeleteRow from "../modals/DeleteRow.svelte"
import RelationshipDisplay from "./RelationshipCell.svelte"
import RoleCell from "./RoleCell.svelte"

const renderers = {
  attachment: attachmentRenderer,
  link: linkedRowRenderer,
}

export function getRenderer({ schema, editable, isUsersTable }) {
  const rendererParams = {
    options: schema.options,
    constraints: schema.constraints,
    editable,
  }
  if (renderers[schema.type]) {
    return renderers[schema.type](rendererParams)
  } else if (isUsersTable && schema.name === "roleId") {
    return roleRenderer(rendererParams)
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

export function userRowRenderer(params) {
  const container = document.createElement("div")
  container.style.height = "100%"
  container.style.display = "flex"
  container.style.alignItems = "center"

  new EditRow({
    target: container,
    props: {
      row: params.data,
      modalContentComponent: CreateEditUser,
    },
  })

  return container
}

function attachmentRenderer() {
  return params => {
    const container = document.createElement("div")
    container.style.height = "100%"
    container.style.display = "flex"
    container.style.alignItems = "center"

    new AttachmentList({
      target: container,
      props: {
        files: params.value || [],
      },
    })

    return container
  }
}

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

function roleRenderer() {
  return params => {
    let container = document.createElement("div")
    container.style.display = "grid"
    container.style.height = "100%"
    container.style.alignItems = "center"

    new RoleCell({
      target: container,
      props: {
        roleId: params.value,
      },
    })

    return container
  }
}
