import { EditorView } from "@codemirror/view"
import { getManifest } from "@budibase/string-templates"
import sanitizeHtml from "sanitize-html"
import { groupBy } from "lodash"

export const EditorModes = {
  JS: {
    name: "javascript",
    json: false,
    match: /\$$/,
  },
  Handlebars: {
    name: "handlebars",
    base: "text/html",
    match: /{{[\s]*[\w\s]*/,
  },
  Text: {
    name: "text/html",
  },
}

export const SECTIONS = {
  HB_HELPER: {
    name: "Helper",
    type: "helper",
    icon: "Code",
  },
}

export const getDefaultTheme = opts => {
  const { height, resize, dark } = opts
  return EditorView.theme(
    {
      "&.cm-focused .cm-cursor": {
        borderLeftColor: "var(--spectrum-alias-text-color)",
      },
      "&": {
        height: height ? `${height}` : "",
        lineHeight: "1.3",
        border:
          "var(--spectrum-alias-border-size-thin) solid var(--spectrum-alias-border-color)",
        borderRadius: "var(--border-radius-s)",
        backgroundColor:
          "var( --spectrum-textfield-m-background-color, var(--spectrum-global-color-gray-50) )",
        resize: resize ? `${resize}` : "",
        overflow: "hidden",
        color: "var(--spectrum-alias-text-color)",
      },
      "& .cm-tooltip.cm-tooltip-autocomplete > ul": {
        fontFamily:
          "var(--spectrum-alias-body-text-font-family, var(--spectrum-global-font-family-base))",
        maxHeight: "16em",
      },
      "& .cm-placeholder": {
        color: "var(--spectrum-alias-text-color)",
        fontStyle: "italic",
      },
      "&.cm-focused": {
        outline: "none",
        borderColor: "var(--spectrum-alias-border-color-mouse-focus)",
      },
      // AUTO COMPLETE
      "& .cm-completionDetail": {
        fontStyle: "unset",
        textTransform: "uppercase",
        fontSize: "10px",
        backgroundColor: "var(--spectrum-global-color-gray-100)",
        color: "var(--spectrum-global-color-gray-600)",
      },
      "& .cm-completionLabel": {
        marginLeft:
          "calc(var(--spectrum-alias-workflow-icon-size-m) + var(--spacing-m))",
      },
      "& .info-bubble": {
        fontSize: "var(--font-size-s)",
        display: "grid",
        gridGap: "var(--spacing-s)",
        gridTemplateColumns: "1fr",
        color: "var(--spectrum-global-color-gray-800)",
      },
      "& .cm-tooltip": {
        marginLeft: "var(--spacing-s)",
        border: "1px solid var(--spectrum-global-color-gray-300)",
        borderRadius:
          "var( --spectrum-popover-border-radius, var(--spectrum-alias-border-radius-regular) )",
        backgroundColor: "var(--spectrum-global-color-gray-50)",
      },
      // Section header
      "& .info-section": {
        display: "flex",
        padding: "var(--spacing-s)",
        gap: "var(--spacing-m)",
        borderBottom: "1px solid var(--spectrum-global-color-gray-200)",
        color: "var(--spectrum-global-color-gray-800)",
        fontWeight: "bold",
      },
      "& .info-section .spectrum-Icon": {
        color: "var(--spectrum-global-color-gray-600)",
      },
      // Autocomplete Option
      "& .cm-tooltip.cm-tooltip-autocomplete .autocomplete-option": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "var(--spectrum-alias-font-size-default)",
        padding: "var(--spacing-s)",
        color: "var(--spectrum-global-color-gray-800)",
      },
      "& .cm-tooltip-autocomplete ul li[aria-selected].autocomplete-option": {
        backgroundColor: "var(--spectrum-global-color-gray-200)",
      },
      "& .binding-wrap": {
        color: "var(--spectrum-global-color-blue-700)",
        fontFamily: "monospace",
      },
    },
    { dark }
  )
}

export const buildHelperInfoNode = (completion, helper) => {
  const ele = document.createElement("div")
  ele.classList.add("info-bubble")

  const exampleNodeHtml = helper.example
    ? `<div class="binding__example">${helper.example}</div>`
    : ""
  const descriptionMarkup = sanitizeHtml(helper.description, {
    allowedTags: [],
    allowedAttributes: {},
  })
  const descriptionNodeHtml = `<div class="binding__description">${descriptionMarkup}</div>`

  ele.innerHTML = `
    ${exampleNodeHtml}
    ${descriptionNodeHtml}
  `
  return ele
}

const toSpectrumIcon = name => {
  return `<svg
    class="spectrum-Icon spectrum-Icon--sizeM"
    focusable="false"
    aria-hidden="false"
    aria-label="${name}-section-icon"
  >
    <use style="pointer-events: none;" xlink:href="#spectrum-icon-18-${name}" />
  </svg>`
}

export const buildSectionHeader = (type, sectionName, icon, rank) => {
  const ele = document.createElement("div")
  ele.classList.add("info-section")
  ele.classList.add(type)
  ele.innerHTML = `${toSpectrumIcon(icon)}<span>${sectionName}</span>`
  return {
    name: sectionName,
    header: () => ele,
    rank,
  }
}

export const helpersToCompletion = (helpers, mode) => {
  const { type, name: sectionName, icon } = SECTIONS.HB_HELPER
  const helperSection = buildSectionHeader(type, sectionName, icon, 99)

  return Object.keys(helpers).reduce((acc, key) => {
    let helper = helpers[key]
    acc.push({
      label: key,
      info: completion => {
        return buildHelperInfoNode(completion, helper)
      },
      type: "helper",
      section: helperSection,
      detail: "FUNCTION",
      apply: (view, completion, from, to) => {
        insertBinding(view, from, to, key, mode)
      },
    })
    return acc
  }, [])
}

export const getHelperCompletions = mode => {
  const manifest = getManifest()
  return Object.keys(manifest).reduce((acc, key) => {
    acc = acc || []
    return [...acc, ...helpersToCompletion(manifest[key], mode)]
  }, [])
}

const bindingFilter = (options, query) => {
  return options.filter(completion => {
    const section_parsed = completion.section.name.toLowerCase()
    const label_parsed = completion.label.toLowerCase()
    const query_parsed = query.toLowerCase()

    return (
      section_parsed.includes(query_parsed) ||
      label_parsed.includes(query_parsed)
    )
  })
}

export const hbAutocomplete = baseCompletions => {
  async function coreCompletion(context) {
    let bindingStart = context.matchBefore(EditorModes.Handlebars.match)

    let options = baseCompletions || []

    if (!bindingStart) {
      return null
    }
    // Accommodate spaces
    const match = bindingStart.text.match(/{{[\s]*/)
    const query = bindingStart.text.replace(match[0], "")
    let filtered = bindingFilter(options, query)

    return {
      from: bindingStart.from + match[0].length,
      filter: false,
      options: filtered,
    }
  }

  return coreCompletion
}

export const jsAutocomplete = baseCompletions => {
  async function coreCompletion(context) {
    let jsBinding = context.matchBefore(/\$\("[\s\w]*/)
    let options = baseCompletions || []

    if (jsBinding) {
      // Accommodate spaces
      const match = jsBinding.text.match(/\$\("[\s]*/)
      const query = jsBinding.text.replace(match[0], "")
      let filtered = bindingFilter(options, query)
      return {
        from: jsBinding.from + match[0].length,
        filter: false,
        options: filtered,
      }
    }

    return null
  }

  return coreCompletion
}

export const buildBindingInfoNode = (completion, binding) => {
  const ele = document.createElement("div")
  ele.classList.add("info-bubble")

  const exampleNodeHtml = binding.readableBinding
    ? `<div class="binding__example">{{ ${binding.readableBinding} }}</div>`
    : ""

  const descriptionNodeHtml = binding.description
    ? `<div class="binding__description">${binding.description}</div>`
    : ""

  ele.innerHTML = `
    ${exampleNodeHtml}
    ${descriptionNodeHtml}
  `
  return ele
}

// Readdress these methods. They shouldn't be used
export const hbInsert = (value, from, to, text) => {
  let parsedInsert = ""

  const left = from ? value.substring(0, from) : ""
  const right = to ? value.substring(to) : ""

  if (!left.includes("{{") || !right.includes("}}")) {
    parsedInsert = `{{ ${text} }}`
  } else {
    parsedInsert = ` ${text} `
  }

  return parsedInsert
}

export function jsInsert(value, from, to, text, { helper } = {}) {
  let parsedInsert = ""

  const left = from ? value.substring(0, from) : ""
  const right = to ? value.substring(to) : ""

  if (helper) {
    parsedInsert = `helpers.${text}()`
  } else if (!left.includes('$("') || !right.includes('")')) {
    parsedInsert = `$("${text}")`
  } else {
    parsedInsert = text
  }

  return parsedInsert
}

// Autocomplete apply behaviour
export const insertBinding = (view, from, to, text, mode) => {
  let parsedInsert

  if (mode.name == "javascript") {
    parsedInsert = jsInsert(view.state.doc?.toString(), from, to, text)
  } else if (mode.name == "handlebars") {
    parsedInsert = hbInsert(view.state.doc?.toString(), from, to, text)
  } else {
    console.log("Unsupported")
    return
  }

  let bindingClosePattern = mode.name == "javascript" ? /[\s]*"\)/ : /[\s]*}}/
  let sliced = view.state.doc?.toString().slice(to)

  const rightBrace = sliced.match(bindingClosePattern)
  let cursorPos = from + parsedInsert.length

  if (rightBrace) {
    cursorPos = from + parsedInsert.length + rightBrace[0].length
  }

  view.dispatch({
    changes: {
      from,
      to,
      insert: parsedInsert,
    },
    selection: {
      anchor: cursorPos,
    },
  })
}

export const bindingsToCompletions = (bindings, mode) => {
  const bindingByCategory = groupBy(bindings, "category")
  const categoryMeta = bindings?.reduce((acc, ele) => {
    acc[ele.category] = acc[ele.category] || {}

    if (ele.icon) {
      acc[ele.category]["icon"] = acc[ele.category]["icon"] || ele.icon
    }
    if (typeof ele.display?.rank == "number") {
      acc[ele.category]["rank"] = acc[ele.category]["rank"] || ele.display.rank
    }
    return acc
  }, {})

  const completions = Object.keys(bindingByCategory).reduce((comps, catKey) => {
    const { icon, rank } = categoryMeta[catKey] || {}

    const bindindSectionHeader = buildSectionHeader(
      bindingByCategory.type,
      catKey,
      icon || "",
      typeof rank == "number" ? rank : 1
    )

    return [
      ...comps,
      ...bindingByCategory[catKey].reduce((acc, binding) => {
        let displayType = binding.fieldSchema?.type || binding.display?.type
        acc.push({
          label: binding.display?.name || "NO NAME",
          info: completion => {
            return buildBindingInfoNode(completion, binding)
          },
          type: "binding",
          detail: displayType,
          section: bindindSectionHeader,
          apply: (view, completion, from, to) => {
            insertBinding(view, from, to, binding.readableBinding, mode)
          },
        })
        return acc
      }, []),
    ]
  }, [])

  return completions
}
