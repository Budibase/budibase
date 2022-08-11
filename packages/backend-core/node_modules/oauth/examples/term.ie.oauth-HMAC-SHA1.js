var util= require('util')

var OAuth= require('../lib/oauth').OAuth;

var oa= new OAuth("http://term.ie/oauth/example/request_token.php",
                  "http://term.ie/oauth/example/access_token.php",
                  "key",
                  "secret",
                  "1.0",
                  null,
                  "HMAC-SHA1")

oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
  if(error) util.puts('error :' + error)
  else { 
    util.puts('oauth_token :' + oauth_token)
    util.puts('oauth_token_secret :' + oauth_token_secret)
    util.puts('requestoken results :' + util.inspect(results))
    util.puts("Requesting access token")
    oa.getOAuthAccessToken(oauth_token, oauth_token_secret, function(error, oauth_access_token, oauth_access_token_secret, results2) {
      util.puts('oauth_access_token :' + oauth_access_token)
      util.puts('oauth_token_secret :' + oauth_access_token_secret)
      util.puts('accesstoken results :' + util.inspect(results2))
      util.puts("Requesting access token")
      var data= "";
      oa.getProtectedResource("http://term.ie/oauth/example/echo_api.php?foo=bar&too=roo", "GET", oauth_access_token, oauth_access_token_secret,  function (error, data, response) {
          util.puts(data);
      });
    });
  }
})
