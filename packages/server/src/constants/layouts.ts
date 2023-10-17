export const BASE_LAYOUT_PROP_IDS = {
  PRIVATE: "layout_private_master",
  PUBLIC: "layout_public_master",
}

export const EMPTY_LAYOUT = {
  componentLibraries: ["@budibase/standard-components"],
  title: "{{ name }}",
  favicon: "./_shared/favicon.png",
  stylesheets: [],
  props: {
    _id: "30b8822a-d07b-49f4-9531-551e37c6899b",
    _component: "@budibase/standard-components/layout",
    _children: [
      {
        _id: "7fcf11e4-6f5b-4085-8e0d-9f3d44c98967",
        _component: "@budibase/standard-components/screenslot",
        _instanceName: "Screen slot",
        _styles: {
          normal: {
            flex: "1 1 auto",
            display: "flex",
            "flex-direction": "column",
            "justify-content": "flex-start",
            "align-items": "stretch",
          },
          hover: {},
          active: {},
          selected: {},
        },
        _children: [],
      },
    ],
    _styles: {
      active: {},
      hover: {},
      normal: {},
      selected: {},
    },
    navigation: "Top",
    width: "Large",
    links: [
      {
        text: "Home",
        url: "/",
      },
    ],
  },
}

export const BASE_LAYOUTS = [
  {
    _id: BASE_LAYOUT_PROP_IDS.PRIVATE,
    componentLibraries: ["@budibase/standard-components"],
    title: "{{ name }}",
    favicon: "./_shared/favicon.png",
    stylesheets: [],
    name: "Navigation Layout",
    props: {
      _id: "4f569166-a4f3-47ea-a09e-6d218c75586f",
      _instanceName: "Navigation Layout",
      _component: "@budibase/standard-components/layout",
      _children: [
        {
          _id: "7fcf11e4-6f5b-4085-8e0d-9f3d44c98967",
          _component: "@budibase/standard-components/screenslot",
          _instanceName: "Screen slot",
          _styles: {
            normal: {
              flex: "1 1 auto",
              display: "flex",
              "flex-direction": "column",
              "justify-content": "flex-start",
              "align-items": "stretch",
            },
            hover: {},
            active: {},
            selected: {},
          },
          _children: [],
        },
      ],
      _styles: {
        active: {},
        hover: {},
        normal: {},
        selected: {},
      },
      title: "{{ name }}",
      navigation: "Top",
      width: "Large",
      links: [
        {
          text: "Home",
          url: "/",
        },
      ],
    },
  },
  {
    _id: BASE_LAYOUT_PROP_IDS.PUBLIC,
    componentLibraries: ["@budibase/standard-components"],
    title: "{{ name }}",
    favicon: "./_shared/favicon.png",
    stylesheets: [],
    name: "Empty Layout",
    props: {
      _id: "3723ffa1-f9e0-4c05-8013-98195c788ed6",
      _instanceName: "Empty Layout",
      _component: "@budibase/standard-components/layout",
      _children: [
        {
          _id: "7fcf11e4-6f5b-4085-8e0d-9f3d44c98967",
          _component: "@budibase/standard-components/screenslot",
          _instanceName: "Screen slot",
          _styles: {
            normal: {
              flex: "1 1 auto",
              display: "flex",
              "flex-direction": "column",
              "justify-content": "flex-start",
              "align-items": "stretch",
            },
            hover: {},
            active: {},
            selected: {},
          },
          _children: [],
        },
      ],
      _styles: {
        active: {},
        hover: {},
        normal: {},
        selected: {},
      },
      navigation: "None",
      width: "Large",
      links: [
        {
          text: "Home",
          url: "/",
        },
      ],
    },
  },
]
