export const defaultPagesObject = () => ({
    main: {
        index: {
            _component : "./components/indexHtml"
        },
        appBody: "bbapp.main.json"
    },
    unauthenticated: {
        index: {
            _component : "./components/indexHtml"
        },
        appBody: "bbapp.unauthenticated.json"
    },
    componentLibraries: ["./components"]
});