node-oauth
===========
A simple oauth API for node.js .  This API allows users to authenticate against OAUTH providers, and thus act as OAuth consumers. It also has support for OAuth Echo, which is used for communicating with 3rd party media providers such as TwitPic and yFrog.

Tested against Twitter (http://twitter.com), term.ie (http://term.ie/oauth/example/), TwitPic, and Yahoo!

Also provides rudimentary OAuth2 support, tested against facebook, github, foursquare, google and Janrain.   For more complete usage examples please take a look at connect-auth (http://github.com/ciaranj/connect-auth)

[![Clone in Koding](http://learn.koding.com/btn/clone_d.png)][koding]
[koding]: https://koding.com/Teamwork?import=https://github.com/ciaranj/node-oauth/archive/master.zip&c=git1
[![Pair on Thinkful](https://tf-assets-staging.s3.amazonaws.com/badges/thinkful_repo_badge.svg)][Thinkful]
[Thinkful]: http://start.thinkful.com/node/?utm_source=github&utm_medium=badge&utm_campaign=node-oauth

Installation
============== 

    $ npm install oauth


Examples
==========

To run examples/tests install Mocha `$ npm install -g mocha` and run `$ mocha you-file-name.js`:

## OAuth1.0

```javascript
describe('OAuth1.0',function(){
  var OAuth = require('oauth');

  it('tests trends Twitter API v1.1',function(done){
    var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      'your application consumer key',
      'your application secret',
      '1.0A',
      null,
      'HMAC-SHA1'
    );
    oauth.get(
      'https://api.twitter.com/1.1/trends/place.json?id=23424977',
      'your user token for this app', //test user token
      'your user secret for this app', //test user secret            
      function (e, data, res){
        if (e) console.error(e);        
        console.log(require('util').inspect(data));
        done();      
      });    
  });
});
```

## OAuth2.0 
```javascript
describe('OAuth2',function(){
  var OAuth = require('oauth');

   it('gets bearer token', function(done){
     var OAuth2 = OAuth.OAuth2;    
     var twitterConsumerKey = 'your key';
     var twitterConsumerSecret = 'your secret';
     var oauth2 = new OAuth2(server.config.keys.twitter.consumerKey,
       twitterConsumerSecret, 
       'https://api.twitter.com/', 
       null,
       'oauth2/token', 
       null);
     oauth2.getOAuthAccessToken(
       '',
       {'grant_type':'client_credentials'},
       function (e, access_token, refresh_token, results){
       console.log('bearer: ',access_token);
       done();
     });
   });
```

Change History
============== 
* 0.9.15
    - OAuth2:   Allow specification of agent
* 0.9.14
    - OAuth2:   Extend 'successful' token responses to include anything in the 2xx range.
* 0.9.13
    - OAuth2:   Fixes the "createCredentials() is deprecated, use tls.createSecureContext instead" message. (thank you AJ ONeal)
* 0.9.12
    - OAuth1/2: Can now pass Buffer instance directly for PUTs+POSTs (thank you Evan Prodromou)
    - OAuth1:   Improve interoperability with libraries that mess with the prototype. (thank you Jose Ignacio Andres)
    - OAuth2:   Adds PUT support for OAuth2 (thank you Derek Brooks)
    - OAuth1:   Improves use_strict compatibility (thank you Ted Goddard)
* 0.9.11
    - OAuth2:   No longer sends the type=webserver argument with the OAuth2 requests (thank you bendiy)
    - OAuth2:   Provides a default (and overrideable) User-Agent header (thanks to Andrew Martens & Daniel Mahlow)
    - OAuth1:   New followRedirects client option (true by default) (thanks to Pieter Joost van de Sande)
    - OAuth1:   Adds RSA-SHA1 support (thanks to Jeffrey D. Van Alstine  & Michael Garvin &  Andreas Knecht)
* 0.9.10
    - OAuth2:   Addresses 2 issues that came in with 0.9.9, #129 & #125 (thank you José F. Romaniello)
* 0.9.9
    - OAuth1:   Fix the mismatch between the output of querystring.stringify() and this._encodeData(). (thank you rolandboon)
    - OAuth2:   Adds Authorization Header and supports extra headers by default ( thanks to Brian Park)
* 0.9.8
    - OAuth1:   Support overly-strict OAuth server's that require whitespace separating the Authorization Header parameters  (e.g. 500px.com) (Thanks to Christian Schwarz)
    - OAuth1:   Fix incorrect double-encoding of PLAINTEXT OAuth connections (Thanks to Joe Rozner)
    - OAuth1:   Minor safety check added when checking hostnames. (Thanks to Garrick Cheung)
* 0.9.7
    - OAuth2:   Pass back any extra response data for calls to getOAuthAccessToken (Thanks to Tang Bo Hao)
    - OAuth2:   Don't force a https request if given a http url (Thanks to Damien Mathieu)
    - OAuth2:   Supports specifying a grant-type of 'refresh-token' (Thanks to Luke Baker)
* 0.9.6
    - OAuth2:   Support for 302 redirects (Thanks Patrick Negri). 
    - OAuth1/2: Some code tidying. ( Thanks to Raoul Millais )  
* 0.9.5
    - OAuth1:   Allow usage of HTTP verbs other than GET for retrieving the access and request tokens (Thanks to Raoul Millais)  
* 0.9.4
    - OAuth1/2: Support for OAuth providers that drop connections (don't send response lengths? [Google]) 
    - OAuth2:   Change getOAuthAccessToken to POST rather than GET ( Possible Breaking change!!! ... re-tested against Google, Github, Facebook, FourSquare and Janrain and seems ok .. is closer to the spec (v20) )  
* 0.9.3
    - OAuth1:   Adds support for following 301 redirects (Thanks bdickason) 
* 0.9.2 
    - OAuth1:   Correct content length calculated for non-ascii post bodies (Thanks selead)  
    - OAuth1:   Allowed for configuration of the 'access token' name used when requesting protected resources (OAuth2)  
* 0.9.1
    - OAuth1:   Added support for automatically following 302 redirects (Thanks neyric) 
    - OAuth1:   Added support for OAuth Echo (Thanks Ryan LeFevre). 
    - OAuth1:   Improved handling of 2xx responses (Thanks Neil Mansilla).  
* 0.9.0
    - OAuth1/2: Compatibility fixes to bring node-oauth up to speed with node.js 0.4x [thanks to Rasmus Andersson for starting the work ]  
* 0.8.4
    - OAuth1:   Fixed issue #14 (Parameter ordering ignored encodings).
    - OAuth1:   Added support for repeated parameter names.
    - OAuth1/2: Implements issue #15 (Use native SHA1 if available, 10x speed improvement!).
    - OAuth2:   Fixed issue #16 (Should use POST when requesting access tokens.).
    - OAuth2:   Fixed Issue #17 (OAuth2 spec compliance).  
    - OAuth1:   Implemented enhancement #13 (Adds support for PUT & DELETE http verbs). 
    - OAuth1:   Fixes issue #18 (Complex/Composite url arguments [thanks novemberborn])  
* 0.8.3
    - OAuth1:   Fixed an issue where the auth header code depended on the Array's toString method (Yohei Sasaki) Updated the getOAuthRequestToken method so we can access google's OAuth secured methods. Also re-implemented and fleshed out the test suite.  
* 0.8.2
    - OAuth1:   The request returning methods will now write the POST body if provided (Chris Anderson), the code responsible for manipulating the headers is a bit safe now when working with other code (Paul McKellar)
    - Package:  Tweaked the package.json to use index.js instead of main.js  
* 0.8.1
    - OAuth1:   Added mechanism to get hold of a signed Node Request object, ready for attaching response listeners etc. (Perfect for streaming APIs)  
* 0.8.0
    - OAuth1:   Standardised method capitalisation, the old getOauthAccessToken is now getOAuthAccessToken (Breaking change to existing code)  
* 0.7.7
    - OAuth1:   Looks like non oauth_ parameters where appearing within the Authorization headers, which I believe to be incorrect.  
* 0.7.6
    - OAuth1:   Added in oauth_verifier property to getAccessToken required for 1.0A  
* 0.7.5
    - Package:  Added in a main.js to simplify the require'ing of OAuth  
* 0.7.4
    - OAuth1:   Minor change to add an error listener to the OAuth client (thanks troyk)  
* 0.7.3
    - OAuth2:   Now sends a Content-Length Http header to keep nginx happy :)  
* 0.7.2
    - OAuth1:   Fixes some broken unit tests!  
* 0.7.0
    - OAuth1/2: Introduces support for HTTPS end points and callback URLS for OAuth 1.0A and Oauth 2 (Please be aware that this was a breaking change to the constructor arguments order)  

Contributors (In no particular order)
=====================================

* Evan Prodromou
* Jose Ignacio Andres
* Ted Goddard
* Derek Brooks
* Ciaran Jessup - ciaranj@gmail.com
* Mark Wubben - http://equalmedia.com/
* Ryan LeFevre - http://meltingice.net
* Raoul Millais
* Patrick Negri - http://github.com/pnegri
* Tang Bo Hao - http://github.com/btspoony
* Damien Mathieu - http://42.dmathieu.com
* Luke Baker - http://github.com/lukebaker
* Christian Schwarz  - http://github.com/chrischw/
* Joe Rozer - http://www.deadbytes.net
* Garrick Cheung - http://www.garrickcheung.com/
* rolandboon - http://rolandboon.com
* Brian Park - http://github.com/yaru22
* José F. Romaniello - http://github.com/jfromaniello
* bendiy - https://github.com/bendiy
* Andrew Martins - http://www.andrewmartens.com
* Daniel Mahlow - https://github.com/dmahlow
* Pieter Joost van de Sande - https://github.com/pjvds
* Jeffrey D. Van Alstine
* Michael Garvin
* Andreas Knecht
* AJ ONeal
* Philip Skinner - https://github.com/PhilipSkinner
