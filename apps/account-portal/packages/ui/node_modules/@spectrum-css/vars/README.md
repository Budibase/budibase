# `@spectrum-css/vars`

The vars component contains all the variables that drive the presentation of a component.

## CSS Usage

The files within the `css/` folder are unprocessed Spectrum  DNA output. These contain ALL variables with raw data for each. These should be used if variables are required at build time.

The files within the `dist/css/` folder contain processed DNA output, with references to only the DNA variables that change between color stops and scales. These should be if CSS custom properties are being used in-browser.

## Updating DNA tokens / variables from Spectrum DNA


Update the DNA version in `package.json`

`"@spectrum/spectrum-dna": "^x.y.z",`


In root directory:

```
yarn install 
yarn add -W -O @spectrum/spectrum-dna
```

Run the DNA update script:

```
cd components/vars
npm run update
```

Commit the new files with `git add .; git commit -m "feat: update DNA to x.y.z"` with x.y.z being the DNA version number matching the update in `package.json`.

### Potential error resolving solutions
Clean Lerna, remove node_modules and reinstall Yarn dependencies. 
```
npx lerna clean
rm -rf node_modules/
rm .yarnrc
yarn install 
```