# Google APIs Node.js Client

[![Build Status][travisimg]][travis]
[![Code Coverage][coverallsimg]][coveralls]
[![Dependencies][david-dm-img]][david-dm]

This is Google's officially supported [node.js][node] client library for using
OAuth 2.0 authorization and authentication with Google APIs.

### Questions/problems?

* Ask your development related questions on [![Ask a question on Stackoverflow][overflowimg]][stackoverflow]
* If you've found an bug/issue, please [file it on GitHub][bugs].

## Installation

This library is distributed on `npm`. To add it as a dependency,
run the following command:

``` sh
$ npm install google-auth-library --save
```

## Application Default Credentials
This library provides an implementation of [Application Default Credentials][] for Node.js.

The [Application Default Credentials][] provide a simple way to get authorization credentials for use
in calling Google APIs.

They are best suited for cases when the call needs to have the same identity and authorization
level for the application independent of the user. This is the recommended approach to authorize
calls to Cloud APIs, particularly when you're building an application that uses Google Compute
Engine.

#### Download your Service Account Credentials JSON file

To use `Application Default Credentials`, You first need to download a set of
JSON credentials for your project. Go to **APIs & Auth** > **Credentials** in
the [Google Developers Console][devconsole] and select
**Service account** from the **Add credentials** dropdown.

> This file is your *only copy* of these credentials. It should never be
> committed with your source code, and should be stored securely.

Once downloaded, store the path to this file in the
`GOOGLE_APPLICATION_CREDENTIALS` environment variable.

#### Enable the API you want to use

Before making your API call, you must be sure the API you're calling has been
enabled. Go to **APIs & Auth** > **APIs** in the
[Google Developers Console][devconsole] and enable the APIs you'd like to
call. For the example below, you must enable the `DNS API`.

#### Call an API

As long as you update the environment variable below to point to *your* JSON
credentials file, and the fill in the placeholder variables from your project,
the following snippet should work.

```js
var google = require('googleapis');
var GoogleAuth = require('google-auth-library');

var authFactory = new GoogleAuth();
var dns = google.dns('v1');

authFactory.getApplicationDefault(function(err, authClient) {
  if (err) {
    console.log('Authentication failed because of ', err);
    return;
  }
  if (authClient.createScopedRequired && authClient.createScopedRequired()) {
    var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
    authClient = authClient.createScoped(scopes);
  }

  var request = {
    // TODO: Change placeholders below to values for parameters to the 'get' method:

    // Identifies the project addressed by this request.
    project: "",
    // Identifies the managed zone addressed by this request. Can be the managed zone name or id.
    managedZone: "",
    // The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.
    changeId: "",
    // Auth client
    auth: authClient
  };

  dns.changes.get(request, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
});
```

## Contributing

See [CONTRIBUTING][contributing].

## License

This library is licensed under Apache 2.0. Full license text is
available in [LICENSE][copying].

[travisimg]: https://api.travis-ci.org/google/google-auth-library-nodejs.svg
[bugs]: https://github.com/google/google-auth-library-nodejs/issues
[node]: http://nodejs.org/
[travis]: https://travis-ci.org/google/google-auth-library-nodejs
[stackoverflow]: http://stackoverflow.com/questions/tagged/google-auth-library-nodejs
[apiexplorer]: https://developers.google.com/apis-explorer
[urlshort]: https://developers.google.com/url-shortener/
[usingkeys]: https://developers.google.com/console/help/#UsingKeys
[contributing]: https://github.com/google/google-auth-library-nodejs/blob/master/.github/CONTRIBUTING.md
[copying]: https://github.com/google/google-auth-library-nodejs/tree/master/LICENSE
[authdocs]: https://developers.google.com/accounts/docs/OAuth2Login
[request]: https://github.com/mikeal/request
[requestopts]: https://github.com/mikeal/request#requestoptions-callback
[stream]: http://nodejs.org/api/stream.html#stream_class_stream_readable
[stability]: http://nodejs.org/api/stream.html#stream_stream
[overflowimg]: https://googledrive.com/host/0ByfSjdPVs9MZbkhjeUhMYzRTeEE/stackoveflow-tag.png
[devconsole]: https://console.developer.google.com
[oauth]: https://developers.google.com/accounts/docs/OAuth2
[options]: https://github.com/google/google-auth-library-nodejs/tree/master#options
[gcloud]: https://github.com/GoogleCloudPlatform/gcloud-node
[cloudplatform]: https://developers.google.com/cloud/
[coveralls]: https://coveralls.io/r/google/google-auth-library-nodejs?branch=master
[coverallsimg]: https://img.shields.io/coveralls/google/google-auth-library-nodejs.svg
[Application Default Credentials]: https://developers.google.com/identity/protocols/application-default-credentials#callingnode
[david-dm-img]: https://david-dm.org/google/google-auth-library-nodejs/status.svg
[david-dm]: https://david-dm.org/google/google-auth-library-nodejs
