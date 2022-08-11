# AWS SDK for JavaScript

[![NPM version](https://img.shields.io/npm/v/aws-sdk.svg)](https://www.npmjs.com/package/aws-sdk)
[![NPM downloads](https://img.shields.io/npm/dm/aws-sdk.svg)](https://www.npmjs.com/package/aws-sdk)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/aws/aws-sdk-js)

[![Build Status](https://travis-ci.org/aws/aws-sdk-js.svg?branch=master)](https://travis-ci.org/aws/aws-sdk-js)
[![Coverage Status](https://codecov.io/gh/aws/aws-sdk-js/branch/master/graph/badge.svg)](https://codecov.io/gh/aws/aws-sdk-js)
[![Known Vulnerabilities](https://snyk.io/test/github/aws/aws-sdk-js/badge.svg)](https://snyk.io/test/github/aws/aws-sdk-js)

## Version 3.x Now Available
The [version 3.x](https://github.com/aws/aws-sdk-js-v3) of the AWS SDK for JavaScript is generally available.
For more information see the [Developer Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
or [API Reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html).

For release notes, see the [CHANGELOG](https://github.com/aws/aws-sdk-js/blob/master/CHANGELOG.md). Prior to v2.4.8, release notes can be found at https://aws.amazon.com/releasenotes/?tag=releasenotes%23keywords%23javascript

## Table of Contents:
* [Getting Started](#getting-Started)
* [Getting Help](#getting-help)
* [Contributing](#contributing)

## Getting Started

## How To Install

### In the Browser

To use the SDK in the browser, simply add the following script tag to your
HTML pages:

    <script src="https://sdk.amazonaws.com/js/aws-sdk-2.1030.0.min.js"></script>

You can also build a custom browser SDK with your specified set of AWS services.
This can allow you to reduce the SDK's size, specify different API versions of
services, or use AWS services that don't currently support CORS if you are
working in an environment that does not enforce CORS. To get started:

http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/building-sdk-for-browsers.html

The AWS SDK is also compatible with [browserify](http://browserify.org).

For browser-based web, mobile and hybrid apps, you can use [AWS Amplify Library](https://aws.github.io/aws-amplify/?utm_source=aws-js-sdk&utm_campaign=browser) which extends the AWS SDK and provides an easier and declarative interface.

### In Node.js

The preferred way to install the AWS SDK for Node.js is to use the
[npm](http://npmjs.org) package manager for Node.js. Simply type the following
into a terminal window:

```sh
npm install aws-sdk
```

### In React Native
To use the SDK in a react native project, first install the SDK using npm:

```sh
npm install aws-sdk
```

Then within your application, you can reference the react native compatible version of the SDK with the following:

```javascript
var AWS = require('aws-sdk/dist/aws-sdk-react-native');
```

Alternatively, you can use [AWS Amplify Library](https://aws.github.io/aws-amplify/media/react_native_guide?utm_source=aws-js-sdk&utm_campaign=react-native) which extends AWS SDK and provides React Native UI components and CLI support to work with AWS services.

### Using Bower

You can also use [Bower](http://bower.io) to install the SDK by typing the
following into a terminal window:

```sh
bower install aws-sdk-js
```

## Usage with TypeScript
The AWS SDK for JavaScript bundles TypeScript definition files for use in TypeScript projects and to support tools that can read `.d.ts` files.
Our goal is to keep these TypeScript definition files updated with each release for any public api.

### Pre-requisites
Before you can begin using these TypeScript definitions with your project, you need to make sure your project meets a few of these requirements:

 * Use TypeScript v2.x
 * Includes the TypeScript definitions for node. You can use npm to install this by typing the following into a terminal window:

    ```sh
    npm install --save-dev @types/node
    ```

 * If you are targeting at es5 or older ECMA standards, your `tsconfig.json` has to include `'es5'` and `'es2015.promise'` under `compilerOptions.lib`.
 See [tsconfig.json](https://github.com/aws/aws-sdk-js/blob/master/ts/tsconfig.json) for an example.

### In the Browser
To use the TypeScript definition files with the global `AWS` object in a front-end project, add the following line to the top of your JavaScript file:

```javascript
/// <reference types="aws-sdk" />
```

This will provide support for the global `AWS` object.

### In Node.js
To use the TypeScript definition files within a Node.js project, simply import `aws-sdk` as you normally would.

In a TypeScript file:

```javascript
// import entire SDK
import AWS from 'aws-sdk';
// import AWS object without services
import AWS from 'aws-sdk/global';
// import individual service
import S3 from 'aws-sdk/clients/s3';
```

**NOTE:** You need to add `"esModuleInterop": true` to compilerOptions of your `tsconfig.json`. If not possible, use like `import * as AWS from 'aws-sdk'`.

In a JavaScript file:

```javascript
// import entire SDK
var AWS = require('aws-sdk');
// import AWS object without services
var AWS = require('aws-sdk/global');
// import individual service
var S3 = require('aws-sdk/clients/s3');
```

### With React

To create React applications with AWS SDK, you can use [AWS Amplify Library](https://aws.github.io/aws-amplify/media/react_guide?utm_source=aws-js-sdk&utm_campaign=react) which provides React components and CLI support to work with AWS services.

### With Angular
Due to the SDK's reliance on node.js typings, you may encounter compilation 
[issues](https://github.com/aws/aws-sdk-js/issues/1271) when using the
typings provided by the SDK in an Angular project created using the Angular CLI.

To resolve these issues, either add `"types": ["node"]` to the project's `tsconfig.app.json`
file, or remove the `"types"` field entirely.

[AWS Amplify Library](https://aws.github.io/aws-amplify/media/angular_guide?utm_source=aws-js-sdk&utm_campaign=angular) provides Angular components and CLI support to work with AWS services.

### Known Limitations
There are a few known limitations with the bundled TypeScript definitions at this time:

 * Service client typings reflect the latest `apiVersion`, regardless of which `apiVersion` is specified when creating a client.
 * Service-bound parameters use the `any` type.

# Getting Help

The best way to interact with our team is through GitHub. 
You can [open an issue](https://github.com/aws/aws-sdk-js/issues/new/choose) and choose from one of our templates for 
[bug reports](https://github.com/aws/aws-sdk-js/issues/new?assignees=&labels=bug%2C+needs-triage&template=---bug-report.md&title=), 
[feature requests](https://github.com/aws/aws-sdk-js/issues/new?assignees=&labels=feature-request&template=---feature-request.md&title=) 
or [guidance](https://github.com/aws/aws-sdk-js/issues/new?assignees=&labels=guidance%2C+needs-triage&template=---questions---help.md&title=). 
You may also find help on community resources such as [StackOverFlow](https://stackoverflow.com/questions/tagged/aws-sdk-js) with the tag #aws-sdk-js.
If you have a support plan with [AWS Support](https://aws.amazon.com/premiumsupport/), you can also create a new support case.

Please make sure to check out our resources too before opening an issue:
* Our [Developer Guide](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/welcome.html) and [API reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/)
* Our [Changelog](https://github.com/aws/aws-sdk-js/blob/master/CHANGELOG.md) for recent changes.
* Our [code examples](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sdk-code-samples.html).

Please see [SERVICES.md](https://github.com/aws/aws-sdk-js/blob/master/SERVICES.md) for a list of supported services.

# Maintenance and support for SDK major versions
For information about maintenance and support for SDK major versions and their underlying dependencies, see the following in the [AWS SDKs and Tools Shared Configuration and Credentials Reference Guide](https://docs.aws.amazon.com/credref/latest/refdocs/overview.html):
* [AWS SDKs and Tools Maintenance Policy](https://docs.aws.amazon.com/credref/latest/refdocs/maint-policy.html)
* [AWS SDKs and Tools Version Support Matrix](https://docs.aws.amazon.com/credref/latest/refdocs/version-support-matrix.html)



# Contributing
We welcome community contributions and pull requests. See [CONTRIBUTING.md](https://github.com/aws/aws-sdk-js/blob/master/CONTRIBUTING.md) for information on how to set up a development environment and submit code.

## License

This SDK is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE.txt and NOTICE.txt for more information.
