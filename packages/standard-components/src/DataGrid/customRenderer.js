// Custom renderers to handle special types
// https://www.ag-grid.com/javascript-grid-cell-rendering-components/

import AttachmentCell from './AttachmentCell/Button.svelte'

export const booleanRenderer = (params) => {
    const toggle = (e) => {
        params.value = !params.value
        params.setValue(e.currentTarget.checked)
    }
    let input = document.createElement("input")
    input.type = "checkbox"
    input.checked = params.value
    input.addEventListener("click", toggle)

    return input
}
export const attachmentRenderer = (params) => {
    let container = document.createElement("div")

    const attachment = new AttachmentCell({
        target: container,
        props: {
            files: params.value || [],
        }
    });

    return container
}