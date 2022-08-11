/**
 * Parse profile.
 *
 * Parses user profile as fetched from Google Contacts API.
 *
 * Note that the following scope must have been requested and granted in order
 * to access the Google Contacts API:
 *     { scope: 'https://www.google.com/m8/feeds' }
 *
 * References:
 *   - https://developers.google.com/google-apps/contacts/v3/
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.id = json.feed.id['$t']
  profile.displayName = json.feed.author[0].name['$t'];
  profile.emails = [{ value: json.feed.author[0].email['$t'] }];
  
  return profile;
};
