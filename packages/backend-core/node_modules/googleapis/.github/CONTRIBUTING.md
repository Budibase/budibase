# Contributing

Before making any contributions, please sign one of the contributor
license agreements below.

Fork the repo, develop and test your code changes.

Install all dependencies including development requirements by running:

``` sh
$ npm install -d
```

Tests are run using mocha. To run all tests just run:

``` sh
$ npm test
```

which looks for tests in the `test/` directory.

Your code should honor the [Google JavaScript Style Guide][js-guide].
You can use [Closure Linter][c-linter] to detect style issues.

Submit a pull request. The repo owner will review your request. If it is
approved, the change will be merged. If it needs additional work, the repo
owner will respond with useful comments.

## Generating APIs

If you're a developer interested in contributing to this library, the following
section will be useful for you. Each of the files in `apis/` is generated from
the discovery docs available online. You can generate these files by running
the following command:

``` sh
npm run generate-apis
```

You can pass in custom Discovery URLs or paths to discovery docs:

``` sh
node scripts/generate http://discoveryurl.example.com /path/to/discoverydoc.json
```

## Generating Documentation

You can generate the documentation for the APIs by running:

``` sh
npm run generate-docs
```

Documentation will be generated in `docs/`.

## Preparing for release

Before releasing a new version, you should generate all APIs, run tests,
bump the version in `package.json` and create a git tag for the release. You
can automate all this with a patch version bump (version += 0.0.1) by running:

``` sh
npm run prepare
```

## Contributor License Agreements

Before creating a pull request, please fill out either the individual or
corporate Contributor License Agreement.

* If you are an individual writing original source code and you're sure you
own the intellectual property, then you'll need to sign an
[individual CLA][indv-cla].
* If you work for a company that wants to allow you to contribute your work
to this client library, then you'll need to sign a
[corporate CLA][corp-cla].

Follow either of the two links above to access the appropriate CLA and
instructions for how to sign and return it. Once we receive it, we'll add you
to the official list of contributors and be able to accept your patches.

[js-guide]: https://google.github.io/styleguide/jsguide.html
[c-linter]: https://code.google.com/p/closure-linter/
[indv-cla]: https://developers.google.com/open-source/cla/individual
[corp-cla]: https://developers.google.com/open-source/cla/corporate
