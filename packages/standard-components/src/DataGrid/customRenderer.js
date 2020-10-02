// Custom renderers to handle special types
// https://www.ag-grid.com/javascript-grid-cell-rendering-components/

import AttachmentList from '../attachments/AttachmentList.svelte'

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

    const app = new AttachmentList({
        target: container,
        props: {
            // assuming App.svelte contains something like
            // `export let answer`:
            files: params.value || [],
        }
    });

    return container
}