// Custom renderers to handle special types
// https://www.ag-grid.com/javascript-grid-cell-rendering-components/

import AttachmentCell from './AttachmentCell/Button.svelte'
import { DatePicker } from "@budibase/bbui"

export default new Map([
    ["boolean", booleanRenderer],
    ["attachment", attachmentRenderer],
    ["datetime", dateRenderer],
])

function booleanRenderer(params) {
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
function attachmentRenderer(params) {
    const container = document.createElement("div")

    const attachmentInstance = new AttachmentCell({
        target: container,
        props: {
            files: params.value || [],
        }
    });

    return container
}
function dateRenderer(params) {
    const container = document.createElement("div")

    const datePickerInstance = new DatePicker({
        target: container,
        props: {
            value: params.value,
        }
    });

    return container
}