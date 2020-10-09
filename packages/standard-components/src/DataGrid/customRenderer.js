// Custom renderers to handle special types
// https://www.ag-grid.com/javascript-grid-cell-rendering-components/

import AttachmentCell from './AttachmentCell/Button.svelte'
import Select from './Select/Wrapper.svelte'
import { DatePicker } from "@budibase/bbui"

const renderers = new Map([
    ["boolean", booleanRenderer],
    ["attachment", attachmentRenderer],
    ["datetime", dateRenderer],
    ["options", optionsRenderer],
])


export function getRenderer(type, options) {
    if (renderers.get(type)) {
        return renderers.get(type)(options)
    } else {
        return false
    }
}

function booleanRenderer(options) {
    return params => {
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
}
function attachmentRenderer(options) {
    return params => {
        const container = document.createElement("div")

        const attachmentInstance = new AttachmentCell({
            target: container,
            props: {
                files: params.value || [],
            }
        });

        return container
    }
}
function dateRenderer(options) {
    return params => {
        const container = document.createElement("div")
        const toggle = (e) => {
            params.setValue(e.detail[0][0])
        }

        // Options need to be passed in with minTime and maxTime! Needs bbui update.

        const datePickerInstance = new DatePicker({
            target: container,
            props: {
                value: params.value,
                thin: true
            }
        });

        datePickerInstance.$on('change', toggle)

        return container
    }
}


function optionsRenderer({ inclusion }) {
    return params => {
        const container = document.createElement("div")
        const change = (e) => {
            params.setValue(e.detail)
        }

        const selectInstance = new Select({
            target: container,
            props: {
                value: params.value,
                options: inclusion
            }
        });

        selectInstance.$on('change', change)

        return container
    }
}