# Getting Started

The budibase-pro repository is created to be consumed as a git submodule, so is recommended editing it via the main Budibase repository. Using git submodules allows us to include code from a separate, private repository within our project, while maintaining separate versioning and commit histories.

To fetch it, checkout the [Budibase repo](https://github.com/Budibase/budibase) and run the following command from the `budibase` root: `yarn submodules:load`

Your budibase-pro repo will now be available as any other package, found in `/packages/pro/`

## Working with the submodule

To commit changes to pro, you must first navigate to the submodule directory (`/packages/pro/`) and commit the changes separately. Once you've committed the changes, you will see that the reference has been updated in the `budibase` repository.You can then commit the reference to the new commit in the `budibase` repository.

## Unloading the submodule

If you are not working with the submodule and want use the already compiled npm repository version, you can run the command `yarn submodules:unload` from the `budibase` root. This will get rid of any local reference.
Benefits of doing this:

- Your build will be slightly quicker
- No hassle about submodule updates (if any)

Cons:

- You will not detect any breaking change that affects the `pro` package.

We do not recommend unloading the package, unless there is a good reason for it. Having it loaded, your local build experience will be closer to the real one for CI, develop and production.

## Releases

This is the release process pre-feature branching - this process will not be required once we move to continuous delivery.

During the release process you will need to go through the following steps:
1. Merge the `Budibase/budibase-pro` develop branch to the master branch, you can use a PR for this
2. Create a release candidate branch within the mono-repo, from `develop`, named like `august-2023-develop`
3. Create a PR from this branch to `master`
4. On the release candidate branch, update the pro submodule reference to `master`
  - `cd packages/pro`
  - `git fetch`
  - `git checkout master`
  - `cd ../..`
  - `git add packages/pro` and commit this as a reference update

From here you can merge the PR to master and the reference to pro will be correct - this also makes sure that the correct branch is maintained on the `develop` branch.


