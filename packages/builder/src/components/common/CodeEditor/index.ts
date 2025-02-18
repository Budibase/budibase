import { getManifest } from "@budibase/string-templates"
import sanitizeHtml from "sanitize-html"
import { groupBy } from "lodash"
import { EditorModesMap, Helper, Snippet } from "@budibase/types"
import { CompletionContext } from "@codemirror/autocomplete"
import { EditorView } from "@codemirror/view"
import { BindingCompletion, BindingCompletionOption } from "@/types"

export const EditorModes: EditorModesMap = {
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

const buildHelperInfoNode = (helper: Helper) => {
  const ele = document.createElement("div")
  ele.classList.add("info-bubble")

  const exampleNodeHtml = helper.example
    ? `<div class="binding__example helper">${helper.example}</div>`
    : ""
  const descriptionMarkup = sanitizeHtml(helper.description, {
    allowedTags: [],
    allowedAttributes: {},
  })
  const descriptionNodeHtml = `<div class="binding__description helper">${descriptionMarkup}</div>`

  ele.innerHTML = `
    ${descriptionNodeHtml}
    ${exampleNodeHtml}
  `
  return ele
}

const toSpectrumIcon = (name: string) => {
  return `<svg
    class="spectrum-Icon spectrum-Icon--sizeS"
    focusable="false"
    aria-hidden="false"
    aria-label="${name}-section-icon"
    style="color:var(--spectrum-global-color-gray-700)"
  >
    <use style="pointer-events: none;" xlink:href="#spectrum-icon-18-${name}" />
  </svg>`
}

const buildSectionHeader = (
  type: string,
  sectionName: string,
  icon: string,
  rank: number
) => {
  const ele = document.createElement("div")
  ele.classList.add("info-section")
  if (type) {
    ele.classList.add(type)
  }
  ele.innerHTML = `${toSpectrumIcon(icon)}<span>${sectionName}</span>`
  return {
    name: sectionName,
    header: () => ele,
    rank,
  }
}

const helpersToCompletion = (
  helpers: Record<string, Helper>,
  mode: { name: "javascript" | "handlebars" }
): BindingCompletionOption[] => {
  const helperSection = buildSectionHeader("helper", "Helpers", "Code", 99)

  return Object.keys(helpers).flatMap(helperName => {
    const helper = helpers[helperName]
    return {
      label: helperName,
      args: helper.args,
      requiresBlock: helper.requiresBlock,
      info: () => buildHelperInfoNode(helper),
      type: "helper",
      section: helperSection,
      detail: "Function",
      apply: (
        view: EditorView,
        _completion: BindingCompletionOption,
        from: number,
        to: number
      ) => {
        insertBinding(view, from, to, helperName, mode, AutocompleteType.HELPER)
      },
    }
  })
}

export const getHelperCompletions = (mode: {
  name: "javascript" | "handlebars"
}): BindingCompletionOption[] => {
  // TODO: manifest needs to be properly typed
  const manifest: any = getManifest()
  return Object.keys(manifest).flatMap(key => {
    return helpersToCompletion(manifest[key], mode)
  })
}

export const snippetAutoComplete = (snippets: Snippet[]): BindingCompletion => {
  return setAutocomplete(
    snippets.map(snippet => ({
      section: buildSectionHeader("snippets", "Snippets", "Code", 100),
      label: `snippets.${snippet.name}`,
      displayLabel: snippet.name,
    }))
  )
}

const bindingFilter = (options: BindingCompletionOption[], query: string) => {
  return options.filter(completion => {
    const section_parsed = completion.section?.toString().toLowerCase()
    const label_parsed = completion.label.toLowerCase()
    const query_parsed = query.toLowerCase()

    return (
      section_parsed?.includes(query_parsed) ||
      label_parsed.includes(query_parsed)
    )
  })
}

export const hbAutocomplete = (
  baseCompletions: BindingCompletionOption[]
): BindingCompletion => {
  function coreCompletion(context: CompletionContext) {
    if (!baseCompletions.length) {
      return null
    }

    const bindingStart = context.matchBefore(EditorModes.Handlebars.match)

    const options = baseCompletions

    if (!bindingStart) {
      return null
    }
    // Accommodate spaces
    const match = bindingStart.text.match(/{{[\s]*/)
    if (!match) {
      return null
    }
    const query = bindingStart.text.replace(match[0], "")
    const filtered = bindingFilter(options, query)

    return {
      from: bindingStart.from + match[0].length,
      filter: false,
      options: filtered,
    }
  }

  return coreCompletion
}

function wrappedAutocompleteMatch(context: CompletionContext) {
  return context.matchBefore(/\$\("[\s\w]*/)
}

export const jsAutocomplete = (
  baseCompletions: BindingCompletionOption[]
): BindingCompletion => {
  function coreCompletion(context: CompletionContext) {
    if (!baseCompletions.length) {
      return null
    }

    const jsBinding = wrappedAutocompleteMatch(context)
    const options = baseCompletions

    if (jsBinding) {
      // Accommodate spaces
      const match = jsBinding.text.match(/\$\("[\s]*/)
      if (!match) {
        return null
      }
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

export const jsHelperAutocomplete = (
  baseCompletions: BindingCompletionOption[]
): BindingCompletion => {
  return setAutocomplete(
    baseCompletions.map(helper => ({
      ...helper,
      displayLabel: helper.label,
      label: `helpers.${helper.label}()`,
    }))
  )
}

function setAutocomplete(
  options: BindingCompletionOption[]
): BindingCompletion {
  return function (context: CompletionContext) {
    if (!options.length) {
      return null
    }

    if (wrappedAutocompleteMatch(context)) {
      return null
    }

    const word = context.matchBefore(/\b\w*(\.\w*)?/)
    if (!word || (word.from == word.to && !context.explicit)) {
      return null
    }

    return {
      from: word.from,
      options,
    }
  }
}

const buildBindingInfoNode = (binding: {
  valueHTML: string
  value: string | null
}) => {
  if (!binding.valueHTML || binding.value == null) {
    return null
  }
  const ele = document.createElement("div")
  ele.classList.add("info-bubble")
  ele.innerHTML = `<div class="binding__example">${binding.valueHTML}</div>`
  return ele
}

// Readdress these methods. They shouldn't be used
export const hbInsert = (
  value: string,
  from: number,
  to: number,
  text: string
) => {
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

export function jsInsert(
  value: string,
  from: number,
  to: number,
  text: string,
  {
    helper,
    disableWrapping,
  }: { helper?: boolean; disableWrapping?: boolean } = {}
) {
  let parsedInsert = ""

  const left = from ? value.substring(0, from) : ""
  const right = to ? value.substring(to) : ""
  if (disableWrapping) {
    parsedInsert = text
  } else if (helper) {
    parsedInsert = `helpers.${text}()`
  } else if (!left.includes('$("') || !right.includes('")')) {
    parsedInsert = `$("${text}")`
  } else {
    parsedInsert = text
  }

  return parsedInsert
}

const enum AutocompleteType {
  BINDING,
  HELPER,
  TEXT,
}

// Autocomplete apply behaviour
const insertBinding = (
  view: EditorView,
  from: number,
  to: number,
  text: string,
  mode: { name: "javascript" | "handlebars" },
  type: AutocompleteType
) => {
  let parsedInsert

  if (mode.name == "javascript") {
    parsedInsert = jsInsert(view.state.doc?.toString(), from, to, text, {
      helper: type === AutocompleteType.HELPER,
      disableWrapping: type === AutocompleteType.TEXT,
    })
  } else if (mode.name == "handlebars") {
    parsedInsert = hbInsert(view.state.doc?.toString(), from, to, text)
  } else {
    console.warn("Unsupported")
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

// TODO: typing in this function isn't great
export const bindingsToCompletions = (
  bindings: any[],
  mode: { name: "javascript" | "handlebars" }
): BindingCompletionOption[] => {
  const bindingByCategory = groupBy(bindings, "category")
  const categoryMeta = bindings?.reduce((acc: any, ele: any) => {
    acc[ele.category] = acc[ele.category] || {}

    if (ele.icon) {
      acc[ele.category]["icon"] = acc[ele.category]["icon"] || ele.icon
    }
    if (typeof ele.display?.rank == "number") {
      acc[ele.category]["rank"] = acc[ele.category]["rank"] || ele.display.rank
    }
    return acc
  }, {})

  const completions = Object.keys(bindingByCategory).reduce<
    BindingCompletionOption[]
  >((comps, catKey) => {
    const { icon, rank } = categoryMeta[catKey] || {}

    const bindingSectionHeader = buildSectionHeader(
      // @ts-ignore something wrong with this - logically this should be dictionary
      bindingByCategory.type,
      catKey,
      icon || "",
      typeof rank == "number" ? rank : 1
    )

    comps.push(
      ...bindingByCategory[catKey].reduce<BindingCompletionOption[]>(
        (acc, binding) => {
          let displayType = binding.fieldSchema?.type || binding.display?.type
          acc.push({
            label:
              binding.display?.name || binding.readableBinding || "NO NAME",
            info: () => buildBindingInfoNode(binding),
            type: "binding",
            detail: displayType,
            section: bindingSectionHeader,
            apply: (
              view: EditorView,
              _completion: BindingCompletionOption,
              from: number,
              to: number
            ) => {
              insertBinding(
                view,
                from,
                to,
                binding.readableBinding.includes(" ")
                  ? `[${binding.readableBinding}]`
                  : binding.readableBinding,
                mode,
                AutocompleteType.BINDING
              )
            },
          })
          return acc
        },
        []
      )
    )

    return comps
  }, [])

  return completions
}
