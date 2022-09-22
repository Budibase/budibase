## Manifest

The `manifest.json` file exports the definitions of all components available in this version
of the client library. The manifest is used by the builder to correctly display components and
their settings, and know how to correctly interact with them.



### Component Definitions

The object key is the name of the component, as exported by `index.js`.

- **name** - the name displayed in the builder
- **description** - not currently used
- **icon** - the icon displayed in the builder
- **hasChildren** - whether the component accepts children or not
- **styleable** - whether the component accepts design props or not
- **dataProvider** - whether the component provides a data context or not
- **bindable** - whether the components provides a bindable value or not
- **settings** - array of settings displayed in the builder

### Settings Definitions

The `type` field in each setting is used by the builder to know which component to use to display
the setting, so it's important that this field is correct. The valid options are:

- **text** - A text field
- **select** - A select dropdown. Accompany these with an `options` field to provide options
- **datasource** - A datasource (e.g. a table or a view)
- **boolean** - A boolean field
- **number** - A numeric text field
- **detailURL** - A URL to a page which displays details about a row.
Exclusively used for grids which link to row details.


The available fields in each setting definition are:

- **type** - the type of field which determines which component the builder will use
to display the setting
- **key** - the key of this setting in the component
- **label** - the label displayed in the builder
- **defaultValue** - the default value of the setting
- **placeholder** - the placeholder for the setting
