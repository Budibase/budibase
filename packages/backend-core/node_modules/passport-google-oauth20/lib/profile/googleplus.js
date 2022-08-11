/**
 * Parse profile.
 *
 * Parses user profiles as fetched from Google's Google+ API.
 *
 * The amount of detail in the profile varies based on the scopes granted by the
 * user.  The following scope values add additional data:
 *
 *     `https://www.googleapis.com/auth/plus.login` - recommended login scope
 *     `profile` - basic profile information
 *     `email` - email address
 *
 * References:
 *   - https://developers.google.com/+/web/api/rest/latest/people/get
 *   - https://developers.google.com/+/web/api/rest/
 *   - https://developers.google.com/+/web/api/rest/oauth
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {}
    , i, len;
  profile.id = json.id;
  profile.displayName = json.displayName;
  if (json.name) {
    profile.name = { familyName: json.name.familyName,
                     givenName: json.name.givenName };
  }
  if (json.emails) {
    profile.emails = [];
    for (i = 0, len = json.emails.length; i < len; ++i) {
      profile.emails.push({ value: json.emails[i].value, type: json.emails[i].type })
    }
  }
  if (json.image) {
    profile.photos = [{ value: json.image.url }];
  }
  profile.gender = json.gender;
  
  return profile;
};
