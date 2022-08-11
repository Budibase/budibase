var vows = require('vows'),
    assert = require('assert'),
    DummyResponse= require('./shared').DummyResponse,
    DummyRequest= require('./shared').DummyRequest,
    events = require('events'),
    OAuth= require('../lib/oauth').OAuth,
    OAuthEcho= require('../lib/oauth').OAuthEcho,
    crypto = require('crypto');

//Valid RSA keypair used to test RSA-SHA1 signature method
var RsaPrivateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
"MIICXQIBAAKBgQDizE4gQP5nPQhzof/Vp2U2DDY3UY/Gxha2CwKW0URe7McxtnmE\n" +
"CrZnT1n/YtfrrCNxY5KMP4o8hMrxsYEe05+1ZGFT68ztms3puUxilU5E3BQMhz1t\n" +
"JMJEGcTt8nZUlM4utli7fHgDtWbhvqvYjRMGn3AjyLOfY8XZvnFkGjipvQIDAQAB\n" +
"AoGAKgk6FcpWHOZ4EY6eL4iGPt1Gkzw/zNTcUsN5qGCDLqDuTq2Gmk2t/zn68VXt\n" +
"tVXDf/m3qN0CDzOBtghzaTZKLGhnSewQ98obMWgPcvAsb4adEEeW1/xigbMiaW2X\n" +
"cu6GhZxY16edbuQ40LRrPoVK94nXQpj8p7w4IQ301Sm8PSECQQD1ZlOj4ugvfhEt\n" +
"exi4WyAaM45fylmN290UXYqZ8SYPI/VliDytIlMfyq5Rv+l+dud1XDPrWOQ0ImgV\n" +
"HJn7uvoZAkEA7JhHNmHF9dbdF9Koj86K2Cl6c8KUu7U7d2BAuB6pPkt8+D8+y4St\n" +
"PaCmN4oP4X+sf5rqBYoXywHlqEei2BdpRQJBAMYgR4cZu7wcXGIL8HlnmROObHSK\n" +
"OqN9z5CRtUV0nPW8YnQG+nYOMG6KhRMbjri750OpnYF100kEPmRNI0VKQIECQE8R\n" +
"fQsRleTYz768ahTVQ9WF1ySErMwmfx8gDcD6jjkBZVxZVpURXAwyehopi7Eix/VF\n" +
"QlxjkBwKIEQi3Ks297kCQQCL9by1bueKDMJO2YX1Brm767pkDKkWtGfPS+d3xMtC\n" +
"KJHHCqrS1V+D5Q89x5wIRHKxE5UMTc0JNa554OxwFORX\n" +
"-----END RSA PRIVATE KEY-----";

var RsaPublicKey = "-----BEGIN PUBLIC KEY-----\n" +
"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDizE4gQP5nPQhzof/Vp2U2DDY3\n" +
"UY/Gxha2CwKW0URe7McxtnmECrZnT1n/YtfrrCNxY5KMP4o8hMrxsYEe05+1ZGFT\n" +
"68ztms3puUxilU5E3BQMhz1tJMJEGcTt8nZUlM4utli7fHgDtWbhvqvYjRMGn3Aj\n" +
"yLOfY8XZvnFkGjipvQIDAQAB\n" +
"-----END PUBLIC KEY-----";

vows.describe('OAuth').addBatch({
    'When newing OAuth': {
      topic: new OAuth(null, null, null, null, null, null, "PLAINTEXT"),
      'followRedirects is enabled by default': function (oa) {
        assert.equal(oa._clientOptions.followRedirects, true)
      }
    },
    'When generating the signature base string described in http://oauth.net/core/1.0/#sig_base_example': {
        topic: new OAuth(null, null, null, null, null, null, "HMAC-SHA1"),
        'we get the expected result string': function (oa) {
          var result= oa._createSignatureBase("GET", "http://photos.example.net/photos",
                                              "file=vacation.jpg&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_nonce=kllo9940pd9333jh&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1191242096&oauth_token=nnch734d00sl2jdk&oauth_version=1.0&size=original")
          assert.equal( result, "GET&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal");
        }
    },
    'When generating the signature with RSA-SHA1': {
        topic: new OAuth(null, null, null, RsaPrivateKey, null, null, "RSA-SHA1"),
        'we get a valid oauth signature': function (oa) {
            var signatureBase = "GET&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DRSA-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal";
            var oauthSignature = oa._createSignature(signatureBase, "xyz4992k83j47x0b");
            
            assert.equal( oauthSignature, "qS4rhWog7GPgo4ZCJvUdC/1ZAax/Q4Ab9yOBvgxSopvmKUKp5rso+Zda46GbyN2hnYDTiA/g3P/d/YiPWa454BEBb/KWFV83HpLDIoqUUhJnlXX9MqRQQac0oeope4fWbGlfTdL2PXjSFJmvfrzybERD/ZufsFtVrQKS3QBpYiw=");
            
            //now check that given the public key we can verify this signature
            var verifier = crypto.createVerify("RSA-SHA1").update(signatureBase);
            var valid = verifier.verify(RsaPublicKey, oauthSignature, 'base64');
            assert.ok( valid, "Signature could not be verified with RSA public key");
        }
    },
    'When generating the signature base string with PLAINTEXT': {
        topic: new OAuth(null, null, null, null, null, null, "PLAINTEXT"),
        'we get the expected result string': function (oa) {
          var result= oa._getSignature("GET", "http://photos.example.net/photos",
                                              "file=vacation.jpg&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_nonce=kllo9940pd9333jh&oauth_signature_method=PLAINTEXT&oauth_timestamp=1191242096&oauth_token=nnch734d00sl2jdk&oauth_version=1.0&size=original",
                                              "test");
          assert.equal( result, "&test");
        }
    },
    'When normalising a url': {
      topic: new OAuth(null, null, null, null, null, null, "HMAC-SHA1"),
      'default ports should be stripped': function(oa) {
        assert.equal( oa._normalizeUrl("https://somehost.com:443/foo/bar"), "https://somehost.com/foo/bar" );
      },
      'should leave in non-default ports from urls for use in signature generation': function(oa) {
        assert.equal( oa._normalizeUrl("https://somehost.com:446/foo/bar"), "https://somehost.com:446/foo/bar" );
        assert.equal( oa._normalizeUrl("http://somehost.com:81/foo/bar"), "http://somehost.com:81/foo/bar" );
      },
      'should add a trailing slash when no path at all is present': function(oa) {
        assert.equal( oa._normalizeUrl("http://somehost.com"),  "http://somehost.com/")
      }
    },
    'When making an array out of the arguments hash' : {
      topic: new OAuth(null, null, null, null, null, null, "HMAC-SHA1"),
      'flatten out arguments that are arrays' : function(oa) {
        var parameters= {"z": "a",
                      "a": ["1", "2"],
                      "1": "c" };
        var parameterResults= oa._makeArrayOfArgumentsHash(parameters);
        assert.equal(parameterResults.length, 4);
        assert.equal(parameterResults[0][0], "1");
        assert.equal(parameterResults[1][0], "z");
        assert.equal(parameterResults[2][0], "a");
        assert.equal(parameterResults[3][0], "a");
      }
    },
    'When ordering the request parameters'  : {
      topic: new OAuth(null, null, null, null, null, null, "HMAC-SHA1"),
      'Order them by name' : function(oa) {
        var parameters= {"z": "a",
                      "a": "b",
                      "1": "c" };
        var parameterResults= oa._sortRequestParams(oa._makeArrayOfArgumentsHash(parameters))
        assert.equal(parameterResults[0][0], "1");
        assert.equal(parameterResults[1][0], "a");
        assert.equal(parameterResults[2][0], "z");
      },
      'If two parameter names are the same then order by the value': function(oa) {
        var parameters= {"z": "a",
                      "a": ["z", "b", "b", "a", "y"],
                      "1": "c" };
        var parameterResults= oa._sortRequestParams(oa._makeArrayOfArgumentsHash(parameters))
        assert.equal(parameterResults[0][0], "1");
        assert.equal(parameterResults[1][0], "a");
        assert.equal(parameterResults[1][1], "a");
        assert.equal(parameterResults[2][0], "a");
        assert.equal(parameterResults[2][1], "b");
        assert.equal(parameterResults[3][0], "a");
        assert.equal(parameterResults[3][1], "b");
        assert.equal(parameterResults[4][0], "a");
        assert.equal(parameterResults[4][1], "y");
        assert.equal(parameterResults[5][0], "a");
        assert.equal(parameterResults[5][1], "z");
        assert.equal(parameterResults[6][0], "z");
      }
    },
    'When normalising the request parameters': {
      topic: new OAuth(null, null, null, null, null, null, "HMAC-SHA1"),
      'the resulting parameters should be encoded and ordered as per http://tools.ietf.org/html/rfc5849#section-3.1 (3.4.1.3.2)' : function(oa) {
        var parameters= {"b5" : "=%3D",
          "a3": ["a", "2 q"],
          "c@": "",
          "a2": "r b",
          "oauth_consumer_key": "9djdj82h48djs9d2",
          "oauth_token":"kkk9d7dh3k39sjv7",
          "oauth_signature_method": "HMAC-SHA1",
          "oauth_timestamp": "137131201",
          "oauth_nonce": "7d8f3e4a",
          "c2" :  ""};
        var normalisedParameterString= oa._normaliseRequestParams(parameters);
        assert.equal(normalisedParameterString, "a2=r%20b&a3=2%20q&a3=a&b5=%3D%253D&c%40=&c2=&oauth_consumer_key=9djdj82h48djs9d2&oauth_nonce=7d8f3e4a&oauth_signature_method=HMAC-SHA1&oauth_timestamp=137131201&oauth_token=kkk9d7dh3k39sjv7");
      }
    },
    'When preparing the parameters for use in signing': {
      topic: new OAuth(null, null, null, null, null, null, "HMAC-SHA1"),
      'We need to be wary of node\'s auto object creation from foo[bar] style url parameters' : function(oa) {
        var result= oa._prepareParameters( "", "", "", "http://foo.com?foo[bar]=xxx&bar[foo]=yyy", {} );
        assert.equal( result[0][0], "bar[foo]")
        assert.equal( result[0][1], "yyy")
        assert.equal( result[1][0], "foo[bar]")
        assert.equal( result[1][1], "xxx")
      }
    },
    'When signing a url': {
      topic: function() {
        var oa= new OAuth(null, null, "consumerkey", "consumersecret", "1.0", null, "HMAC-SHA1");
        oa._getTimestamp= function(){ return "1272399856"; }
        oa._getNonce= function(){ return "ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp"; }
        return oa;
      },
      'Provide a valid signature when no token present': function(oa) {
        assert.equal( oa.signUrl("http://somehost.com:3323/foo/poop?bar=foo"), "http://somehost.com:3323/foo/poop?bar=foo&oauth_consumer_key=consumerkey&oauth_nonce=ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1272399856&oauth_version=1.0&oauth_signature=7ytO8vPSLut2GzHjU9pn1SV9xjc%3D");
      },
      'Provide a valid signature when a token is present': function(oa) {
        assert.equal( oa.signUrl("http://somehost.com:3323/foo/poop?bar=foo", "token"), "http://somehost.com:3323/foo/poop?bar=foo&oauth_consumer_key=consumerkey&oauth_nonce=ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1272399856&oauth_token=token&oauth_version=1.0&oauth_signature=9LwCuCWw5sURtpMroIolU3YwsdI%3D");
      },
      'Provide a valid signature when a token and a token secret is present': function(oa) {
        assert.equal( oa.signUrl("http://somehost.com:3323/foo/poop?bar=foo", "token", "tokensecret"), "http://somehost.com:3323/foo/poop?bar=foo&oauth_consumer_key=consumerkey&oauth_nonce=ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1272399856&oauth_token=token&oauth_version=1.0&oauth_signature=zeOR0Wsm6EG6XSg0Vw%2FsbpoSib8%3D");
      }
    },
    'When getting a request token': {
        topic: function() {
          var oa= new OAuth(null, null, "consumerkey", "consumersecret", "1.0", null, "HMAC-SHA1");
          oa._getTimestamp= function(){ return "1272399856"; }
          oa._getNonce= function(){ return "ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp"; }
          oa._performSecureRequest= function(){ return this.requestArguments = arguments; }
          return oa;
        },
        'Use the HTTP method in the client options': function(oa) {
          oa.setClientOptions({ requestTokenHttpMethod: "GET" });
          oa.getOAuthRequestToken(function() {});
          assert.equal(oa.requestArguments[2], "GET");
        },
        'Use a POST by default': function(oa) {
          oa.setClientOptions({});
          oa.getOAuthRequestToken(function() {});
          assert.equal(oa.requestArguments[2], "POST");
        }
    },
    'When getting an access token': {
        topic: function() {
          var oa= new OAuth(null, null, "consumerkey", "consumersecret", "1.0", null, "HMAC-SHA1");
          oa._getTimestamp= function(){ return "1272399856"; }
          oa._getNonce= function(){ return "ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp"; }
          oa._performSecureRequest= function(){ return this.requestArguments = arguments; }
          return oa;
        },
        'Use the HTTP method in the client options': function(oa) {
          oa.setClientOptions({ accessTokenHttpMethod: "GET" });
          oa.getOAuthAccessToken(function() {});
          assert.equal(oa.requestArguments[2], "GET");
        },
        'Use a POST by default': function(oa) {
          oa.setClientOptions({});
          oa.getOAuthAccessToken(function() {});
          assert.equal(oa.requestArguments[2], "POST");
        }
    },
    'When get authorization header' : {
        topic: function() {
          var oa= new OAuth(null, null, "consumerkey", "consumersecret", "1.0", null, "HMAC-SHA1");
          oa._getTimestamp= function(){ return "1272399856"; }
          oa._getNonce= function(){ return "ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp"; }
          return oa;
        },
        'Provide a valid signature when a token and a token secret is present': function(oa) {
          assert.equal( oa.authHeader("http://somehost.com:3323/foo/poop?bar=foo", "token", "tokensecret"), 'OAuth oauth_consumer_key="consumerkey",oauth_nonce="ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1272399856",oauth_token="token",oauth_version="1.0",oauth_signature="zeOR0Wsm6EG6XSg0Vw%2FsbpoSib8%3D"');
        },
        'Support variable whitespace separating the arguments': function(oa) {
            oa._oauthParameterSeperator= ", ";
            assert.equal( oa.authHeader("http://somehost.com:3323/foo/poop?bar=foo", "token", "tokensecret"), 'OAuth oauth_consumer_key="consumerkey", oauth_nonce="ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1272399856", oauth_token="token", oauth_version="1.0", oauth_signature="zeOR0Wsm6EG6XSg0Vw%2FsbpoSib8%3D"');
        }
    },
    'When get the OAuth Echo authorization header': {
      topic: function () {
        var realm = "http://foobar.com/";
        var verifyCredentials = "http://api.foobar.com/verify.json";
        var oa = new OAuthEcho(realm, verifyCredentials, "consumerkey", "consumersecret", "1.0A", "HMAC-SHA1");
        oa._getTimestamp= function(){ return "1272399856"; }
        oa._getNonce= function(){ return "ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp"; }
        return oa;
      },
      'Provide a valid signature when a token and token secret is present': function (oa) {
        assert.equal( oa.authHeader("http://somehost.com:3323/foo/poop?bar=foo", "token", "tokensecret"), 'OAuth realm="http://foobar.com/",oauth_consumer_key="consumerkey",oauth_nonce="ybHPeOEkAUJ3k2wJT9Xb43MjtSgTvKqp",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1272399856",oauth_token="token",oauth_version="1.0A",oauth_signature="0rr1LhSxACX2IEWRq3uCb4IwtOs%3D"');
      }
    },
    'When non standard ports are used': {
        topic: function() {
          var oa= new OAuth(null, null, null, null, null, null, "HMAC-SHA1"),
          mockProvider= {};

          oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
            assert.equal(headers.Host, "somehost.com:8080");
            assert.equal(hostname, "somehost.com");
            assert.equal(port, "8080");
            return {
              on: function() {},
              end: function() {}
            };
          }
          return oa;
        },
        'getProtectedResource should correctly define the host headers': function(oa) {
          oa.getProtectedResource("http://somehost.com:8080", "GET", "oauth_token", null, function(){})
        }
    },
    'When building the OAuth Authorization header': {
      topic: new OAuth(null, null, null, null, null, null, "HMAC-SHA1"),
      'All provided oauth arguments should be concatentated correctly' : function(oa) {
       var parameters= [
          ["oauth_timestamp",         "1234567"],
          ["oauth_nonce",             "ABCDEF"],
          ["oauth_version",           "1.0"],
          ["oauth_signature_method",  "HMAC-SHA1"],
          ["oauth_consumer_key",      "asdasdnm2321b3"]];
        assert.equal(oa._buildAuthorizationHeaders(parameters), 'OAuth oauth_timestamp="1234567",oauth_nonce="ABCDEF",oauth_version="1.0",oauth_signature_method="HMAC-SHA1",oauth_consumer_key="asdasdnm2321b3"');
      },
      '*Only* Oauth arguments should be concatentated, others should be disregarded' : function(oa) {
       var parameters= [
          ["foo",         "2343"],
          ["oauth_timestamp",         "1234567"],
          ["oauth_nonce",             "ABCDEF"],
          ["bar",             "dfsdfd"],
          ["oauth_version",           "1.0"],
          ["oauth_signature_method",  "HMAC-SHA1"],
          ["oauth_consumer_key",      "asdasdnm2321b3"],
          ["foobar",      "asdasdnm2321b3"]];
        assert.equal(oa._buildAuthorizationHeaders(parameters), 'OAuth oauth_timestamp="1234567",oauth_nonce="ABCDEF",oauth_version="1.0",oauth_signature_method="HMAC-SHA1",oauth_consumer_key="asdasdnm2321b3"');
      },
      '_buildAuthorizationHeaders should not depends on Array.prototype.toString' : function(oa) {
       var _toString = Array.prototype.toString;
       Array.prototype.toString = function(){ return '[Array] ' + this.length; }; // toString overwrite example used in jsdom.
       var parameters= [
          ["foo",         "2343"],
          ["oauth_timestamp",         "1234567"],
          ["oauth_nonce",             "ABCDEF"],
          ["bar",             "dfsdfd"],
          ["oauth_version",           "1.0"],
          ["oauth_signature_method",  "HMAC-SHA1"],
          ["oauth_consumer_key",      "asdasdnm2321b3"],
          ["foobar",      "asdasdnm2321b3"]];
        assert.equal(oa._buildAuthorizationHeaders(parameters), 'OAuth oauth_timestamp="1234567",oauth_nonce="ABCDEF",oauth_version="1.0",oauth_signature_method="HMAC-SHA1",oauth_consumer_key="asdasdnm2321b3"');
       Array.prototype.toString = _toString;
      }
    },
    'When performing the Secure Request' : {
      topic: new OAuth("http://foo.com/RequestToken",
                       "http://foo.com/AccessToken",
                       "anonymous",  "anonymous",
                       "1.0A", "http://foo.com/callback", "HMAC-SHA1"),
      'using the POST method' : {
        'Any passed extra_params should form part of the POST body': function(oa) {
          var post_body_written= false;
          var op= oa._createClient;
          try {
            oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
              return {
                write: function(post_body){
                  post_body_written= true;
                  assert.equal(post_body,"scope=foobar%2C1%2C2");
                }
              };
            }
            oa._performSecureRequest("token", "token_secret", 'POST', 'http://foo.com/protected_resource', {"scope": "foobar,1,2"});
            assert.equal(post_body_written, true);
          }
          finally {
            oa._createClient= op;
          }
        }
      }
    },
    'When performing a secure' : {
      topic: new OAuth("http://foo.com/RequestToken",
                       "http://foo.com/AccessToken",
                       "anonymous",  "anonymous",
                       "1.0A", "http://foo.com/callback", "HMAC-SHA1"),
      'POST' : {
        'if no callback is passed' : {
          'it should return a request object': function(oa) {
            var request= oa.post("http://foo.com/blah", "token", "token_secret", "BLAH", "text/plain")
            assert.isObject(request);
            assert.equal(request.method, "POST");
            request.end();
          }
        },
        'if a callback is passed' : {
          "it should call the internal request's end method and return nothing": function(oa) {
            var callbackCalled= false;
            var op= oa._createClient;
            try {
              oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                return {
                  write: function(){},
                  on: function() {},
                  end: function() {
                    callbackCalled= true;
                  }
                };
              }
              var request= oa.post("http://foo.com/blah", "token", "token_secret", "BLAH", "text/plain", function(e,d){})
              assert.equal(callbackCalled, true);
              assert.isUndefined(request);
            }
            finally {
              oa._createClient= op;
            }
          }
        },
        'if the post_body is a buffer' : {
          "It should be passed through as is, and the original content-type (if specified) should be passed through": function(oa) {
            var op= oa._createClient;
            try {
              var callbackCalled= false;
              oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                assert.equal(headers["Content-Type"], "image/jpeg")
                return {
                  write: function(data){
                    callbackCalled= true;
                    assert.equal(data.length, 4);
                  },
                  on: function() {},
                  end: function() {
                  }
                };
              }
              var request= oa.post("http://foo.com/blah", "token", "token_secret", new Buffer([10,20,30,40]), "image/jpeg")
              assert.equal(callbackCalled, true);
            }
            finally {
              oa._createClient= op;
            }
          },
          "It should be passed through as is, and no content-type is specified.": function(oa) {
            //Should probably actually set application/octet-stream, but to avoid a change in behaviour
            // will just document (here) that the library will set it to application/x-www-form-urlencoded
            var op= oa._createClient;
            try {
              var callbackCalled= false;
              oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                assert.equal(headers["Content-Type"], "application/x-www-form-urlencoded")
                return {
                  write: function(data){
                    callbackCalled= true;
                    assert.equal(data.length, 4);
                  },
                  on: function() {},
                  end: function() {
                  }
                };
              }
              var request= oa.post("http://foo.com/blah", "token", "token_secret", new Buffer([10,20,30,40]))
              assert.equal(callbackCalled, true);
            }
            finally {
              oa._createClient= op;
            }
          }
        },
        'if the post_body is not a string or a buffer' : {
          "It should be url encoded and the content type set to be x-www-form-urlencoded" : function(oa) {
            var op= oa._createClient;
            try {
              var callbackCalled= false;
              oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                assert.equal(headers["Content-Type"], "application/x-www-form-urlencoded")
                return {
                  write: function(data){
                    callbackCalled= true;
                    assert.equal(data, "foo=1%2C2%2C3&bar=1%2B2");
                  },
                  on: function() {},
                  end: function() {
                  }
                };
              }
              var request= oa.post("http://foo.com/blah", "token", "token_secret", {"foo":"1,2,3", "bar":"1+2"})
              assert.equal(callbackCalled, true);
            }
            finally {
              oa._createClient= op;
            }
          }
        },
        'if the post_body is a string' : {
          "and it contains non ascii (7/8bit) characters" : {
           "the content length should be the byte count, and not the string length"  : function(oa) {
             var testString= "Tôi yêu node";
             var testStringLength= testString.length;
             var testStringBytesLength= Buffer.byteLength(testString);
             assert.notEqual(testStringLength, testStringBytesLength); // Make sure we're testing a string that differs between byte-length and char-length!

             var op= oa._createClient;
             try {
               var callbackCalled= false;
               oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                 assert.equal(headers["Content-length"], testStringBytesLength);
                 return {
                   write: function(data){
                     callbackCalled= true;
                     assert.equal(data, testString);
                   },
                   on: function() {},
                   end: function() {
                   }
                 };
                }
                var request= oa.post("http://foo.com/blah", "token", "token_secret", "Tôi yêu node")
                assert.equal(callbackCalled, true);
              }
              finally {
                oa._createClient= op;
              }
           }
          },
          "and no post_content_type is specified" : {
            "It should be written as is, with a content length specified, and the encoding should be set to be x-www-form-urlencoded" : function(oa) {
              var op= oa._createClient;
              try {
                var callbackCalled= false;
                oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                  assert.equal(headers["Content-Type"], "application/x-www-form-urlencoded");
                  assert.equal(headers["Content-length"], 23);
                  return {
                    write: function(data){
                      callbackCalled= true;
                      assert.equal(data, "foo=1%2C2%2C3&bar=1%2B2");
                    },
                    on: function() {},
                    end: function() {
                    }
                  };
                 }
                 var request= oa.post("http://foo.com/blah", "token", "token_secret", "foo=1%2C2%2C3&bar=1%2B2")
                 assert.equal(callbackCalled, true);
               }
               finally {
                 oa._createClient= op;
               }
             }
           },
           "and a post_content_type is specified" : {
             "It should be written as is, with a content length specified, and the encoding should be set to be as specified" : function(oa) {
               var op= oa._createClient;
               try {
                 var callbackCalled= false;
                 oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                   assert.equal(headers["Content-Type"], "unicorn/encoded");
                   assert.equal(headers["Content-length"], 23);
                   return {
                     write: function(data){
                       callbackCalled= true;
                       assert.equal(data, "foo=1%2C2%2C3&bar=1%2B2");
                     },
                     on: function() {},
                     end: function() {
                     }
                   };
                  }
                 var request= oa.post("http://foo.com/blah", "token", "token_secret", "foo=1%2C2%2C3&bar=1%2B2", "unicorn/encoded")
                 assert.equal(callbackCalled, true);
               }
               finally {
                 oa._createClient= op;
               }
             }
           }
         }
       },
       'GET' : {
         'if no callback is passed' : {
           'it should return a request object': function(oa) {
             var request= oa.get("http://foo.com/blah", "token", "token_secret")
             assert.isObject(request);
             assert.equal(request.method, "GET");
             request.end();
           }
         },
         'if a callback is passed' : {
           "it should call the internal request's end method and return nothing": function(oa) {
             var callbackCalled= false;
             var op= oa._createClient;
             try {
               oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                 return {
                   on: function() {},
                   end: function() {
                     callbackCalled= true;
                   }
                 };
               }
               var request= oa.get("http://foo.com/blah", "token", "token_secret", function(e,d) {})
               assert.equal(callbackCalled, true);
               assert.isUndefined(request);
             }
             finally {
               oa._createClient= op;
             }
           }
         },
       },
       'PUT' : {
         'if no callback is passed' : {
           'it should return a request object': function(oa) {
             var request= oa.put("http://foo.com/blah", "token", "token_secret", "BLAH", "text/plain")
             assert.isObject(request);
             assert.equal(request.method, "PUT");
             request.end();
           }
         },
         'if a callback is passed' : {
           "it should call the internal request's end method and return nothing": function(oa) {
             var callbackCalled= 0;
             var op= oa._createClient;
             try {
               oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                 return {
                   on: function() {},
                   write: function(data) {
                     callbackCalled++;
                   },
                   end: function() {
                     callbackCalled++;
                   }
                 };
               }
               var request= oa.put("http://foo.com/blah", "token", "token_secret", "BLAH", "text/plain", function(e,d){})
               assert.equal(callbackCalled, 2);
               assert.isUndefined(request);
             }
             finally {
               oa._createClient= op;
             }
           }
         },
         'if the post_body is a buffer' : {
           "It should be passed through as is, and the original content-type (if specified) should be passed through": function(oa) {
             var op= oa._createClient;
             try {
               var callbackCalled= false;
               oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                 assert.equal(headers["Content-Type"], "image/jpeg")
                 return {
                   write: function(data){
                     callbackCalled= true;
                     assert.equal(data.length, 4);
                   },
                   on: function() {},
                   end: function() {
                   }
                 };
               }
               var request= oa.put("http://foo.com/blah", "token", "token_secret", new Buffer([10,20,30,40]), "image/jpeg")
               assert.equal(callbackCalled, true);
             }
             finally {
               oa._createClient= op;
             }
           },
           "It should be passed through as is, and no content-type is specified.": function(oa) {
             //Should probably actually set application/octet-stream, but to avoid a change in behaviour
             // will just document (here) that the library will set it to application/x-www-form-urlencoded
             var op= oa._createClient;
             try {
               var callbackCalled= false;
               oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                 assert.equal(headers["Content-Type"], "application/x-www-form-urlencoded")
                 return {
                   write: function(data){
                     callbackCalled= true;
                     assert.equal(data.length, 4);
                   },
                   on: function() {},
                   end: function() {
                   }
                 };
               }
               var request= oa.put("http://foo.com/blah", "token", "token_secret", new Buffer([10,20,30,40]))
               assert.equal(callbackCalled, true);
             }
             finally {
               oa._createClient= op;
             }
           }
         },
         'if the post_body is not a string' : {
           "It should be url encoded and the content type set to be x-www-form-urlencoded" : function(oa) {
             var op= oa._createClient;
             try {
               var callbackCalled= false;
               oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                 assert.equal(headers["Content-Type"], "application/x-www-form-urlencoded")
                 return {
                   write: function(data) {
                     callbackCalled= true;
                     assert.equal(data, "foo=1%2C2%2C3&bar=1%2B2");
                   }
                 };
               }
               var request= oa.put("http://foo.com/blah", "token", "token_secret", {"foo":"1,2,3", "bar":"1+2"})
               assert.equal(callbackCalled, true);
             }
             finally {
               oa._createClient= op;
             }
           }
         },
         'if the post_body is a string' : {
           "and no post_content_type is specified" : {
             "It should be written as is, with a content length specified, and the encoding should be set to be x-www-form-urlencoded" : function(oa) {
                var op= oa._createClient;
                try {
                  var callbackCalled= false;
                  oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                    assert.equal(headers["Content-Type"], "application/x-www-form-urlencoded");
                    assert.equal(headers["Content-length"], 23);
                    return {
                      write: function(data) {
                        callbackCalled= true;
                        assert.equal(data, "foo=1%2C2%2C3&bar=1%2B2");
                      }
                    };
                  }
                  var request= oa.put("http://foo.com/blah", "token", "token_secret", "foo=1%2C2%2C3&bar=1%2B2")
                  assert.equal(callbackCalled, true);
                }
                finally {
                  oa._createClient= op;
                }
              }
            },
            "and a post_content_type is specified" : {
              "It should be written as is, with a content length specified, and the encoding should be set to be as specified" : function(oa) {
                var op= oa._createClient;
                try {
                  var callbackCalled= false;
                  oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                    assert.equal(headers["Content-Type"], "unicorn/encoded");
                    assert.equal(headers["Content-length"], 23);
                    return {
                      write: function(data) {
                         callbackCalled= true;
                         assert.equal(data, "foo=1%2C2%2C3&bar=1%2B2");
                       }
                    };
                  }
                  var request= oa.put("http://foo.com/blah", "token", "token_secret", "foo=1%2C2%2C3&bar=1%2B2", "unicorn/encoded")
                  assert.equal(callbackCalled, true);
                }
                finally {
                  oa._createClient= op;
                }
              }
            }
          }
        },
       'DELETE' : {
         'if no callback is passed' : {
           'it should return a request object': function(oa) {
             var request= oa.delete("http://foo.com/blah", "token", "token_secret")
             assert.isObject(request);
             assert.equal(request.method, "DELETE");
             request.end();
           }
         },
         'if a callback is passed' : {
           "it should call the internal request's end method and return nothing": function(oa) {
             var callbackCalled= false;
             var op= oa._createClient;
             try {
               oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                 return {
                   on: function() {},
                   end: function() {
                     callbackCalled= true;
                   }
                 };
               }
               var request= oa.delete("http://foo.com/blah", "token", "token_secret", function(e,d) {})
               assert.equal(callbackCalled, true);
               assert.isUndefined(request);
             }
             finally {
               oa._createClient= op;
             }
           }
         }
       },
       'Request With a Callback' : {
          'and a 200 response code is received' : {
            'it should callback successfully' : function(oa) {
              var op= oa._createClient;
              var callbackCalled = false;
              try {
                oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                  return new DummyRequest( new DummyResponse(200) );
                }
                oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function(error) {
                  // callback
                  callbackCalled= true;
                  assert.equal(error, undefined);
                });
                assert.equal(callbackCalled, true)
              }
              finally {
                oa._createClient= op;
              }
            }
          },
          'and a 210 response code is received' : {
            'it should callback successfully' : function(oa) {
              var op= oa._createClient;
              var callbackCalled = false;
              try {
                oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                  return new DummyRequest( new DummyResponse(210) );
                }
                oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function(error) {
                  // callback
                  callbackCalled= true;
                  assert.equal(error, undefined);
                });
                assert.equal(callbackCalled, true)
              }
              finally {
                oa._createClient= op;
              }
            }
          },
          'And A 301 redirect is received' : {
              'and there is a location header' : {
                'it should (re)perform the secure request but with the new location' : function(oa) {
                  var op= oa._createClient;
                  var psr= oa._performSecureRequest;
                  var responseCounter = 1;
                  var callbackCalled = false;
                  var DummyResponse =function() {
                    if( responseCounter == 1 ){
                      this.statusCode= 301;
                      this.headers= {location:"http://redirectto.com"};
                      responseCounter++;
                    }
                    else {
                      this.statusCode= 200;
                    }
                  }
                  DummyResponse.prototype= events.EventEmitter.prototype;
                  DummyResponse.prototype.setEncoding= function() {}

                  try {
                    oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                      return new DummyRequest( new DummyResponse() );
                    }
                    oa._performSecureRequest= function( oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type,  callback ) {
                      if( responseCounter == 1 ) {
                        assert.equal(url, "http://originalurl.com");
                      }
                      else {
                        assert.equal(url, "http://redirectto.com");
                      }
                      return psr.call(oa, oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type,  callback )
                    }

                    oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function() {
                      // callback
                      assert.equal(responseCounter, 2);
                      callbackCalled= true;
                    });
                    assert.equal(callbackCalled, true)
                  }
                  finally {
                    oa._createClient= op;
                    oa._performSecureRequest= psr;
                  }
                }
              },
              'but there is no location header' : {
                'it should execute the callback, passing the HTTP Response code' : function(oa) {
                  var op= oa._createClient;
                  var callbackCalled = false;
                  try {
                    oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                      return new DummyRequest( new DummyResponse(301) );
                    }
                    oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function(error) {
                      // callback
                      assert.equal(error.statusCode, 301);
                      callbackCalled= true;
                    });
                    assert.equal(callbackCalled, true)
                  }
                  finally {
                    oa._createClient= op;
                  }
                }
              },
              'and followRedirect is true' : {
                'it should (re)perform the secure request but with the new location' : function(oa) {
                  var op= oa._createClient;
                  var psr= oa._performSecureRequest;
                  var responseCounter = 1;
                  var callbackCalled = false;
                  var DummyResponse =function() {
                    if( responseCounter == 1 ){
                      this.statusCode= 301;
                      this.headers= {location:"http://redirectto.com"};
                      responseCounter++;
                    }
                    else {
                      this.statusCode= 200;
                    }
                  }
                  DummyResponse.prototype= events.EventEmitter.prototype;
                  DummyResponse.prototype.setEncoding= function() {}

                  try {
                    oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                      return new DummyRequest( new DummyResponse() );
                    }
                    oa._performSecureRequest= function( oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type,  callback ) {
                      if( responseCounter == 1 ) {
                        assert.equal(url, "http://originalurl.com");
                      }
                      else {
                        assert.equal(url, "http://redirectto.com");
                      }
                      return psr.call(oa, oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type,  callback )
                    }

                    oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function() {
                      // callback
                      assert.equal(responseCounter, 2);
                      callbackCalled= true;
                    });
                    assert.equal(callbackCalled, true)
                  }
                  finally {
                    oa._createClient= op;
                    oa._performSecureRequest= psr;
                  }
                }
              },
              'and followRedirect is false' : {
                'it should not perform the secure request with the new location' : function(oa) {
                  var op= oa._createClient;
                  oa.setClientOptions({ followRedirects: false });
                  var DummyResponse =function() {
                      this.statusCode= 301;
                      this.headers= {location:"http://redirectto.com"};
                  }
                  DummyResponse.prototype= events.EventEmitter.prototype;
                  DummyResponse.prototype.setEncoding= function() {}

                  try {
                    oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                      return new DummyRequest( new DummyResponse() );
                    }
                    oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function(res, data, response) {
                      // callback
                      assert.equal(res.statusCode, 301);
                    });
                  }
                  finally {
                    oa._createClient= op;
                    oa.setClientOptions({followRedirects:true});
                  }
                }
              }
            },
          'And A 302 redirect is received' : {
            'and there is a location header' : {
              'it should (re)perform the secure request but with the new location' : function(oa) {
                var op= oa._createClient;
                var psr= oa._performSecureRequest;
                var responseCounter = 1;
                var callbackCalled = false;
                var DummyResponse =function() {
                  if( responseCounter == 1 ){
                    this.statusCode= 302;
                    this.headers= {location:"http://redirectto.com"};
                    responseCounter++;
                  }
                  else {
                    this.statusCode= 200;
                  }
                }
                DummyResponse.prototype= events.EventEmitter.prototype;
                DummyResponse.prototype.setEncoding= function() {}

                try {
                  oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                    return new DummyRequest( new DummyResponse() );
                  }
                  oa._performSecureRequest= function( oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type,  callback ) {
                    if( responseCounter == 1 ) {
                      assert.equal(url, "http://originalurl.com");
                    }
                    else {
                      assert.equal(url, "http://redirectto.com");
                    }
                    return psr.call(oa, oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type,  callback )
                  }

                  oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function() {
                    // callback
                    assert.equal(responseCounter, 2);
                    callbackCalled= true;
                  });
                  assert.equal(callbackCalled, true)
                }
                finally {
                  oa._createClient= op;
                  oa._performSecureRequest= psr;
                }
              }
            },
            'but there is no location header' : {
              'it should execute the callback, passing the HTTP Response code' : function(oa) {
                var op= oa._createClient;
                var callbackCalled = false;
                try {
                  oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                    return new DummyRequest( new DummyResponse(302) );
                  }
                  oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function(error) {
                    // callback
                    assert.equal(error.statusCode, 302);
                    callbackCalled= true;
                  });
                  assert.equal(callbackCalled, true)
                }
                finally {
                  oa._createClient= op;
                }
              }
            },
            'and followRedirect is true' : {
                'it should (re)perform the secure request but with the new location' : function(oa) {
                  var op= oa._createClient;
                  var psr= oa._performSecureRequest;
                  var responseCounter = 1;
                  var callbackCalled = false;
                  var DummyResponse =function() {
                    if( responseCounter == 1 ){
                      this.statusCode= 302;
                      this.headers= {location:"http://redirectto.com"};
                      responseCounter++;
                    }
                    else {
                      this.statusCode= 200;
                    }
                  }
                  DummyResponse.prototype= events.EventEmitter.prototype;
                  DummyResponse.prototype.setEncoding= function() {}

                  try {
                    oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                      return new DummyRequest( new DummyResponse() );
                    }
                    oa._performSecureRequest= function( oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type,  callback ) {
                      if( responseCounter == 1 ) {
                        assert.equal(url, "http://originalurl.com");
                      }
                      else {
                        assert.equal(url, "http://redirectto.com");
                      }
                      return psr.call(oa, oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type,  callback )
                    }

                    oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function() {
                      // callback
                      assert.equal(responseCounter, 2);
                      callbackCalled= true;
                    });
                    assert.equal(callbackCalled, true)
                  }
                  finally {
                    oa._createClient= op;
                    oa._performSecureRequest= psr;
                  }
                }
              },
              'and followRedirect is false' : {
                'it should not perform the secure request with the new location' : function(oa) {
                  var op= oa._createClient;
                  oa.setClientOptions({ followRedirects: false });
                  var DummyResponse =function() {
                      this.statusCode= 302;
                      this.headers= {location:"http://redirectto.com"};
                  }
                  DummyResponse.prototype= events.EventEmitter.prototype;
                  DummyResponse.prototype.setEncoding= function() {}

                  try {
                    oa._createClient= function( port, hostname, method, path, headers, sshEnabled ) {
                      return new DummyRequest( new DummyResponse() );
                    }
                    oa._performSecureRequest("token", "token_secret", 'POST', 'http://originalurl.com', {"scope": "foobar,1,2"}, null, null, function(res, data, response) {
                      // callback
                      assert.equal(res.statusCode, 302);
                    });
                  }
                  finally {
                    oa._createClient= op;
                    oa.setClientOptions({followRedirects:true});
                  }
                }
              }
          }
       }
     }
}).export(module);
