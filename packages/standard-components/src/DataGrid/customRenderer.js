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

        const datePickerInstance = new DatePicker({
            target: container,
            props: {
                value: params.value,
            }
        });

        datePickerInstance.$on('change', toggle)

        return container
    }
}


function optionsRenderer(options) {
    return params => {
        const container = document.createElement("div")
        const change = (e) => {
            params.setValue(e.detail)
        }

        const selectInstance = new Select({
            target: container,
            props: {
                value: params.value,
                options
            }
        });

        selectInstance.$on('change', change)

        return container
    }
}

export function getRenderer(type, options) {
    // Complicated thing to set options for renderers
    let customRenderer
    if (type === "options" || type === 'datetime') {
        customRenderer = renderers.get(type)(options)
    } else {
        let rendererGenerator = renderers.get(type)
        customRenderer = rendererGenerator ? rendererGenerator() : false
    }
    return customRenderer
}