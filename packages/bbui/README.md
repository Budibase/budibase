# Budibase bbui

A package that handles all common components across the Budibase organisation. You can find the current live version [Here](http://bbui.budibase.com).

## Install

1. Clone
2. `npm install`
3. `npm run svench`

(Note: yarn won't work!)

## Example workflow to create a component

1. Create a file: `Headline.svelte`
2. Create a Svench file: `Headline.svench`
3. Build component and add variants to the Svench file.
4. Once done, re-export the file in `src/index.js`.
5. Publish, update the package in the main project and profit. 

## Guidelines
### Making components

1. Think about re-usability
2. Use the css custom properties (variables) that are in the css stylesheet. This makes it easy to tweak things later down the line.
3. Opt to forward events (`<button on:click>` for example) rather than using callbacks.
4. Avoid adding margins to the outermost container of the component.

### Using components and the styleguide

1. Get familiar with the different props that exist on the component. If something vital is missing, make a PR and add it.
2. Take advantage of the css custom properties in the stylesheet and avoid writing hard-coded values.
4. Since there is no margin on the components, think about the structure of the DOM and how to achieve correct spacing, etc. This can be done using `css grid` + `grid gap` or with a container div where you specify a padding or margin. The best solution depends on the circumstance.

## TODO

* [ ] Figure out a good documentation situation
* [ ] Add testing suite (E2E using Playwright?)

 ## Other
 
 The project uses [Svench](https://github.com/rixo/svench). It is somewhat akin to Storybook but a lot less bloated and much easier to setup. It also supports HMR for quick development.
