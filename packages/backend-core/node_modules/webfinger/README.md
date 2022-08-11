# Webfinger

Webfinger and host-meta client library for Node.js.

It supports:

* XRD documents
* JRD documents
* host-meta
* host-meta.json
* http and https
* RFC 6415 and the upcoming Webfinger RFC (up to draft 09)

## License

Copyright 2012,2013 E14N https://e14n.com/

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## API

### webfinger(address, callback)

Gets link data for the address `address` and returns it to function `callback`.

The `address` argument can be any kind of URL that node.js recognizes;
acct: and http: and https: URLs are the most likely to work.

`callback` should take two arguments: `err` for an error, and `jrd`
for a JRD representation of the Webfinger data.

Note that the data is returned in JRD format even if it's in XRD
format on the server.

This method will first try the `/.well-known/webfinger` endpoint; if
that doesn't work it will fall back to RFC 6415 discovery.

### webfinger(address, rel, callback)

As above, but passes the `rel` parameter to the
`/.well-known/webfinger` endpoint if it's truthy.

This is mostly advisory. Some servers will send all links back
anyways; others don't support the webfinger endpoint, so when we
fallback to RFC 6415 everything is returned.

Even if you pass a `rel` argument, you should still filter the
results. (But future versions of this library may do it for you.)

### webfinger(address, rel, options, callback)

As above, but you can use the `options` object to control
behaviour. Currently, the options are:

* `httpsOnly`: boolean flag, default `false` for whether to only use
  HTTPS for communicating with the server. When this is set, it won't
  use Webfinger, host-meta or LRDD endpoints that aren't HTTPS, and won't
  follow redirect requests to HTTP endpoints.
* `webfingerOnly`: boolean flag, default `false` for whether to only use
  the .well-known/webfinger endpoint. When this is set, it won't
  use host-meta and LRDD endpoints as a fallback.

### lrdd(address, callback)

Explicitly use Host Metadata + LRDD lookup per RFC 6415 and avoid the
/.well-known/webfinger endpoint. Use this if you know a host only
supports LRDD.

### lrdd(address, options, callback)

As above, but with fine control of options. Options include:

* `httpsOnly`: boolean flag, default `false` for whether to only use
  HTTPS for communicating with the server. When this is set, it won't
  use Webfinger, host-meta or LRDD endpoints that aren't HTTPS, and won't
  follow redirect requests to HTTP endpoints.

### hostmeta(address, callback)

Gets link data for the host at `address` and returns it to function `callback`.

`callback` works just like with `webfinger()`.

### hostmeta(address, options, callback)

As above, but you can use the `options` object to control
behaviour. Currently, the options are:

* `httpsOnly`: boolean flag, default `false`, for whether to only use
  HTTPS for communicating with the server. When this is set, it won't
  use host-meta or host-meta.json endpoints that aren't HTTPS, and won't
  follow redirect requests to HTTP endpoints.

### discover(address, callback)

Gets link data for `address` and returns it to function `callback`.

If you've got an address and you don't want to bother figuring out if it's a 
webfinger or a hostname, call this and we'll do it for you.

`callback` works just like with `webfinger()`.

## Testing

The tests set up servers that listen on ports 80 and 443. On most
Unix-like systems, you have to be root to listen on ports below 1024 or whatever.

So, to run the unit tests, you have to go:

    sudo npm test

It's probably not a good idea to sudo any script without thinking
about it pretty hard. I suggest that if you're doing development, you
do it in a virtual machine so you're not sudo'ing dangerous stuff on
your main computer.

# Bugs

Bugs welcome, see:

 https://github.com/e14n/webfinger/issues
