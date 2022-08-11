## 0.10.0 (12/29/2016)

### Breaking bug fixes

* Fix oauth2 token refresh (#109) ([@ianmetcalf][])

### Backwards compatible changes

* Remove unused dependencies and upgrade remaining dependencies. (#112) ([@jmdobry][])
* Add yarn.lock file. (#113) ([@jmdobry][])
* Improve dev scripts. (#114) ([@jmdobry][])
* Improve repo licensing. (#115) ([@jmdobry][])

## 0.9.10 (11/15/2016)

### Changes

* Detect project ID from default application credentials ([@jmdobry][])

## 0.9.9 (10/14/2016)

### Changes

* Handle symlinks to default application credentials ([@JonathanPorta][])
* Add support for detecting project ID. ([@jmdobry][])
* Add support for array of valid audiences ([@gameleon-dev][])
* Fix devconsole links ([@mortonfox][])
* Update request ([@tbetbetbe][])

## 0.9.8 (05/10/2016)

### Changes

* Update README.md ([@tbetbetbe][])
* Check that pem exists before verifying it ([@murgatroid99][])
* Fix User-Agent header ([@matthewloring][])
* Fix some lint errors ([@murgatroid99][])
* Added test for OAuth2Client#request retry, fixed implementation ([@murgatroid99][])
* Fixed returned toString encoding of OAuth2Client.prototype.decodeBase64 method. ([@yamafaktory][])
* Use full compute metadata DNS name ([@jonparrot][])

## 0.9.7 (11/06/2015)

### Changes

* Accept either "accounts.google.com" or "https://accounts.google.com" as the issuer of the ID token issued by Google. ([@mcduan][])
* Update to prevent status code 200 messages from being flagged as errors. ([@ryan-devrel][])
* Update async & request ([@josephpage][])
* Update oauthclient2.js ([@riblee][])
* Update README.md ([@ofrobots][])

## 0.9.6 (05/21/2015)

### Changes

* Corrects return value in getRequestMetadata ([@tbetbetbe][])
* Fixed error code not being parsed correctly ([@fiznool][])

## 0.9.5 (05/07/2015)

### Changes

* Corrects usage of refresh token in jwtclient ([@tbetbetbe][])
* Adds an implementation of JWT Access authorization ([@tbetbetbe][])
* Adds getRequestMetadata() to the API surface ([@tbetbetbe][])
* Adds an implementation of IAM authorization ([@tbetbetbe][])

## 0.9.4 (03/04/2015)

### Changes

* Obtains the instance email and key from gtoken ([@stephenplusplus][])
* Switches from GAPIToken to gtoken ([@stephenplusplus][])
* Updates the sample ([@jasonall][])

[@fiznool]: https://github.com/fiznool
[@jasonall]: https://github.com/jasonall
[@josephpage]: https://github.com/josephpage
[@mcduan]: https://github.com/mcduan
[@ofrobots]: https://github.com/ofrobots
[@riblee]: https://github.com/riblee
[@ryan-devrel]: https://github.com/ryan-devrel
[@stephenplusplus]: https://github.com/stephenplusplus
[@tbetbetbe]: https://github.com/tbetbetbe
[@murgatroid99]: https//github.com/murgatroid99
[@matthewloring]: https://github.com/matthewloring
[@yamafaktory]: https://github.com/yamafaktory
[@jonparrot]: https://github.com/jonparrot
[@JonathanPorta]: https://github.com/JonathanPorta
[@jmdobry]: https://github.com/jmdobry
[@gameleon-dev]: https://github.com/gameleon-dev
[@mortonfox]: https://github.com/mortonfox
