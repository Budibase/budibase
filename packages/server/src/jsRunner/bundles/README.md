# Bundles for isolated-vm

[Isolated-vm](https://github.com/laverdet/isolated-vm) requires for us to have some libraries, such as string-templates helpers, built in a single file without external dependencies. These libraries are pretty much static. To avoid building this in every dev command, in every test command and in every pipeline, these libraries are already compiled and commited into the repo.

## How are they consumed?

These libaries are compiled with a special extension: .ivm.bundle.js. This extension is configured in [esbuild](/scripts/build.js) in order to not be bundled as javascript, and to be treated as a `string` instead. This will allow us to read it's context on runtime and inject it to `isolated-vm`.

## How to update it?

These libraries are pretty much static, but they might require some updates from time to time when something changes on the source code. In order to do this, we just need to run the following command and commit the updated bundles:

```
yarn build:isolated-vm-libs
```
