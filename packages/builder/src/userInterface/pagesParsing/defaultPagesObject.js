export const defaultPagesObject = () => ({
  main: {
    _props: {},
    _screens: {},
    index: {
      _component: "./components/indexHtml",
    },
    appBody: "bbapp.main.json",
  },
  unauthenticated: {
    _props: {},
    _screens: {},
    index: {
      _component: "./components/indexHtml",
    },
    appBody: "bbapp.unauthenticated.json",
  },
  componentLibraries: [],
  stylesheets: [],
})
