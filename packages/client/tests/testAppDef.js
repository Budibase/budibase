import { JSDOM } from "jsdom"
import { loadBudibase } from "../src/index"

export const load = async (page, screens = [], url = "/") => {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body><html>", {
    url: `http://test${url}`,
  })
  autoAssignIds(page.props)
  for (let s of screens) {
    autoAssignIds(s.props)
  }
  setAppDef(dom.window, page, screens)
  addWindowGlobals(dom.window, page, screens, uiFunctions, {
    hierarchy: {},
    actions: [],
    triggers: [],
  })
  const app = await loadBudibase({
    componentLibraries: allLibs(dom.window),
    window: dom.window,
    localStorage: createLocalStorage(),
  })
  return { dom, app }
}

const addWindowGlobals = (
  window,
  page,
  screens,
  uiFunctions,
  appDefinition
) => {
  window["##BUDIBASE_BACKEND_DEFINITION##"] = appDefinition
  window["##BUDIBASE_FRONTEND_DEFINITION##"] = {
    page,
    screens,
    appRootPath: "",
  }
  window["##BUDIBASE_FRONTEND_FUNCTIONS##"] = uiFunctions
}

export const makePage = props => ({ props })
export const makeScreen = (route, props) => ({ props, route })

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

export const walkComponentTree = (node, action) => {
  action(node)

  if (node.children) {
    for (let child of node.children) {
      walkComponentTree(child, action)
    }
  }
}

// this happens for real by the builder...
// ..this only assigns _ids when missing
const autoAssignIds = (props, count = 0) => {
  if (!props._id) {
    props._id = `auto_id_${count}`
  }
  if (props._children) {
    for (let child of props._children) {
      count += 1
      autoAssignIds(child, count)
    }
  }
}

const setAppDef = (window, page, screens) => {
  window["##BUDIBASE_FRONTEND_DEFINITION##"] = {
    componentLibraries: [],
    page,
    screens,
    appRootPath: "",
  }

  window["##BUDIBASE_BACKEND_DEFINITION##"] = {
    hierarchy: {},
  }
}

const allLibs = window => ({
  testlib: maketestlib(window),
})

const createLocalStorage = () => {
  const data = {}
  return {
    getItem: key => data[key],
    setItem: (key, value) => (data[key] = value),
  }
}

const maketestlib = window => ({
  div: function(opts) {
    const node = window.document.createElement("DIV")
    const defaultChild = window.document.createElement("DIV")
    defaultChild.className = "default-child"
    node.appendChild(defaultChild)

    let currentProps = { ...opts.props }
    let childNodes = []

    const set = props => {
      currentProps = Object.assign(currentProps, props)
      node.className = currentProps.className || ""
      if (currentProps._children && currentProps._children.length > 0) {
        if (currentProps.append) {
          for (let c of childNodes) {
            node.removeChild(c)
          }
          const components = currentProps._bb.attachChildren(node, {
            hydrate: false,
          })
          childNodes = components.map(c => c.component._element)
        } else {
          currentProps._bb.attachChildren(node)
        }
      }
    }

    this.$destroy = () => opts.target.removeChild(node)

    this.$set = set
    this._element = node
    set(opts.props)
    opts.target.appendChild(node)
  },

  h1: function(opts) {
    const node = window.document.createElement("H1")

    let currentProps = { ...opts.props }

    const set = props => {
      currentProps = Object.assign(currentProps, props)
      if (currentProps.text) {
        node.innerText = currentProps.text
      }
    }

    this.$destroy = () => opts.target.removeChild(node)

    this.$set = set
    this._element = node
    set(opts.props)
    opts.target.appendChild(node)
  },

  button: function(opts) {
    const node = window.document.createElement("BUTTON")

    let currentProps = { ...opts.props }

    const set = props => {
      currentProps = Object.assign(currentProps, props)
      if (currentProps.onClick) {
        node.addEventListener("click", () => {
          const testText = currentProps.testText || "hello"
          currentProps._bb.call(props.onClick, { testText })
        })
      }
    }

    this.$destroy = () => opts.target.removeChild(node)

    this.$set = set
    this._element = node
    set(opts.props)
    opts.target.appendChild(node)
  },
})

const uiFunctions = {
  never_render: () => {},

  always_render: render => {
    render()
  },

  three_clones: render => {
    for (let i = 0; i < 3; i++) {
      render()
    }
  },

  with_context: render => {
    render({ testKey: "test value" })
  },
}
