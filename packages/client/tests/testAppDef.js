import jsdom, { JSDOM } from "jsdom"
import { loadBudibase } from "../src/index"

export const load = async (page, screens, url, host = "test.com") => {
  screens = screens || []
  url = url || "/"

  const fullUrl = `http://${host}${url}`
  const cookieJar = new jsdom.CookieJar()
  const cookie = btoa('{}{"appId":"TEST_APP_ID"}signature')
  cookieJar.setCookie(
    `budibase:token=${cookie};domain=${host};path=/`,
    fullUrl,
    {
      looseMode: false,
    },
    () => {}
  )

  const dom = new JSDOM("<!DOCTYPE html><html><body></body><html>", {
    url: fullUrl,
    cookieJar,
  })

  autoAssignIds(page.props)
  for (let s of screens) {
    autoAssignIds(s.props)
  }
  setAppDef(dom.window, page, screens)
  addWindowGlobals(dom.window, page, screens, {
    hierarchy: {},
    actions: [],
    triggers: [],
  })
  setComponentCodeMeta(page, screens)
  const app = await loadBudibase({
    componentLibraries: allLibs(dom.window),
    window: dom.window,
    localStorage: createLocalStorage(),
  })
  return { dom, app }
}

const addWindowGlobals = (window, page, screens) => {
  window["##BUDIBASE_FRONTEND_DEFINITION##"] = {
    page,
    screens,
  }
}

export const makePage = props => ({ props })
export const makeScreen = (route, props) => ({ props, route })

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

export const walkComponentTree = (node, action) => {
  action(node)

  // works for nodes or props
  const children = node.children || node._children

  if (children) {
    for (let child of children) {
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

// any component with an id that include "based_on_store" is
// assumed to have code that depends on store value
const setComponentCodeMeta = (page, screens) => {
  const setComponentCodeMeta_single = props => {
    walkComponentTree(props, c => {
      if (c._id.indexOf("based_on_store") >= 0) {
        c._codeMeta = { dependsOnStore: true }
      }
    })
  }
  setComponentCodeMeta_single(page.props)
  for (let s of screens || []) {
    setComponentCodeMeta_single(s.props)
  }
}

const setAppDef = (window, page, screens) => {
  window["##BUDIBASE_FRONTEND_DEFINITION##"] = {
    componentLibraries: [],
    page,
    screens,
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
