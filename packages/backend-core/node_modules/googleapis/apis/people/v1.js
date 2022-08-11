/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint maxlen: false */

'use strict';

var createAPIRequest = require('../../lib/apirequest');
var utils = require('../../lib/utils');

/**
 * Google People API
 *
 * The Google People API service gives access to information about profiles and contacts.
 *
 * @example
 * var google = require('googleapis');
 * var people = google.people('v1');
 *
 * @namespace people
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for People
 */
function People(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.people = {

    /**
     * people.people.get
     *
     * @desc Provides information about a person resource for a resource name. Use `people/me` to indicate the authenticated user.
     *
     * @alias people.people.get
     * @memberOf! people(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resourceName The resource name of the person to provide information about. - To get information about the authenticated user, specify `people/me`. - To get information about any user, specify the resource name that identifies the user, such as the resource names returned by [`people.connections.list`](/people/api/rest/v1/people.connections/list).
     * @param {string=} params.requestMask.includeField Comma-separated list of fields to be included in the response. Omitting this field will include all fields. Each path should start with `person.`: for example, `person.names` or `person.photos`.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://people.googleapis.com/v1/{resourceName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['resourceName'],
        pathParams: ['resourceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * people.people.getBatchGet
     *
     * @desc Provides information about a list of specific people by specifying a list of requested resource names. Use `people/me` to indicate the authenticated user.
     *
     * @alias people.people.getBatchGet
     * @memberOf! people(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.resourceNames The resource name, such as one returned by [`people.connections.list`](/people/api/rest/v1/people.connections/list), of one of the people to provide information about. You can include this parameter up to 50 times in one request.
     * @param {string=} params.requestMask.includeField Comma-separated list of fields to be included in the response. Omitting this field will include all fields. Each path should start with `person.`: for example, `person.names` or `person.photos`.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getBatchGet: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://people.googleapis.com/v1/people:batchGet',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    connections: {

      /**
       * people.people.connections.list
       *
       * @desc Provides a list of the authenticated user's contacts merged with any linked profiles.
       *
       * @alias people.people.connections.list
       * @memberOf! people(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resourceName The resource name to return connections for. Only `people/me` is valid.
       * @param {string=} params.pageToken The token of the page to be returned.
       * @param {integer=} params.pageSize The number of connections to include in the response. Valid values are between 1 and 500, inclusive. Defaults to 100.
       * @param {string=} params.sortOrder The order in which the connections should be sorted. Defaults to `LAST_MODIFIED_ASCENDING`.
       * @param {string=} params.syncToken A sync token, returned by a previous call to `people.connections.list`. Only resources changed since the sync token was created are returned.
       * @param {string=} params.requestMask.includeField Comma-separated list of fields to be included in the response. Omitting this field will include all fields. Each path should start with `person.`: for example, `person.names` or `person.photos`.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      list: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://people.googleapis.com/v1/{resourceName}/connections',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['resourceName'],
          pathParams: ['resourceName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef Person
 * @memberOf! people(v1)
 * @type object
 * @property {string} resourceName The resource name for the person, assigned by the server. An ASCII string with a max length of 27 characters. Always starts with `people/`.
 * @property {string} etag The [HTTP entity tag](https://en.wikipedia.org/wiki/HTTP_ETag) of the resource. Used for web cache validation.
 * @property {people(v1).PersonMetadata} metadata Metadata about the person.
 * @property {people(v1).Locale[]} locales The person&#39;s locale preferences.
 * @property {people(v1).Name[]} names The person&#39;s names.
 * @property {people(v1).Nickname[]} nicknames The person&#39;s nicknames.
 * @property {people(v1).CoverPhoto[]} coverPhotos The person&#39;s cover photos.
 * @property {people(v1).Photo[]} photos The person&#39;s photos.
 * @property {people(v1).Gender[]} genders The person&#39;s genders.
 * @property {string} ageRange The person&#39;s age range.
 * @property {people(v1).Birthday[]} birthdays The person&#39;s birthdays.
 * @property {people(v1).Event[]} events The person&#39;s events.
 * @property {people(v1).Address[]} addresses The person&#39;s street addresses.
 * @property {people(v1).Residence[]} residences The person&#39;s residences.
 * @property {people(v1).EmailAddress[]} emailAddresses The person&#39;s email addresses.
 * @property {people(v1).PhoneNumber[]} phoneNumbers The person&#39;s phone numbers.
 * @property {people(v1).ImClient[]} imClients The person&#39;s instant messaging clients.
 * @property {people(v1).Tagline[]} taglines The person&#39;s taglines.
 * @property {people(v1).Biography[]} biographies The person&#39;s biographies.
 * @property {people(v1).Url[]} urls The person&#39;s associated URLs.
 * @property {people(v1).Organization[]} organizations The person&#39;s past or current organizations.
 * @property {people(v1).Occupation[]} occupations The person&#39;s occupations.
 * @property {people(v1).Interest[]} interests The person&#39;s interests.
 * @property {people(v1).Skill[]} skills The person&#39;s skills.
 * @property {people(v1).BraggingRights[]} braggingRights The person&#39;s bragging rights.
 * @property {people(v1).Relation[]} relations The person&#39;s relations.
 * @property {people(v1).RelationshipInterest[]} relationshipInterests The kind of relationship the person is looking for.
 * @property {people(v1).RelationshipStatus[]} relationshipStatuses The person&#39;s relationship statuses.
 * @property {people(v1).Membership[]} memberships The person&#39;s group memberships.
 */
/**
 * @typedef PersonMetadata
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).Source[]} sources The sources of data for the person.
 * @property {string[]} previousResourceNames Any former resource names this person has had. Populated only for [`connections.list`](/people/api/rest/v1/people.connections/list) requests that include a sync token. The resource name may change when adding or removing fields that link a contact and profile such as a verified email, verified phone number, or profile URL.
 * @property {boolean} deleted True if the person resource has been deleted. Populated only for [`connections.list`](/people/api/rest/v1/people.connections/list) requests that include a sync token.
 * @property {string} objectType The type of the person object.
 */
/**
 * @typedef Source
 * @memberOf! people(v1)
 * @type object
 * @property {string} type The source type.
 * @property {string} id A unique identifier within the source type generated by the server.
 */
/**
 * @typedef Locale
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the locale.
 * @property {string} value The well-formed [IETF BCP 47](https://tools.ietf.org/html/bcp47) language tag representing the locale.
 */
/**
 * @typedef FieldMetadata
 * @memberOf! people(v1)
 * @type object
 * @property {boolean} primary True if the field is the primary field; false if the field is a secondary field.
 * @property {boolean} verified True if the field is verified; false if the field is unverified. A verified field is typically a name, email address, phone number, or website that has been confirmed to be owned by the person.
 * @property {people(v1).Source} source The source of the field.
 */
/**
 * @typedef Name
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the name.
 * @property {string} displayName The display name formatted according to the locale specified by the viewer&#39;s account or the Accept-Language HTTP header.
 * @property {string} familyName The family name.
 * @property {string} givenName The given name.
 * @property {string} middleName The middle name(s).
 * @property {string} honorificPrefix The honorific prefixes, such as `Mrs.` or `Dr.`
 * @property {string} honorificSuffix The honorific suffixes, such as `Jr.`
 * @property {string} phoneticFamilyName The family name spelled as it sounds.
 * @property {string} phoneticGivenName The given name spelled as it sounds.
 * @property {string} phoneticMiddleName The middle name(s) spelled as they sound.
 * @property {string} phoneticHonorificPrefix The honorific prefixes spelled as they sound.
 * @property {string} phoneticHonorificSuffix The honorific suffixes spelled as they sound.
 */
/**
 * @typedef Nickname
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the nickname.
 * @property {string} value The nickname.
 * @property {string} type The type of the nickname.
 */
/**
 * @typedef CoverPhoto
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the cover photo.
 * @property {string} url The URL of the cover photo.
 * @property {boolean} default True if the cover photo is the default cover photo; false if the cover photo is a user-provided cover photo.
 */
/**
 * @typedef Photo
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the photo.
 * @property {string} url The URL of the photo.
 */
/**
 * @typedef Gender
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the gender.
 * @property {string} value The gender for the person. The gender can be custom or predefined. Possible values include, but are not limited to, the following: * `male` * `female` * `other` * `unknown`
 * @property {string} formattedValue The read-only value of the gender translated and formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 */
/**
 * @typedef Birthday
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the birthday.
 * @property {people(v1).Date} date The date of the birthday.
 * @property {string} text A free-form string representing the user&#39;s birthday.
 */
/**
 * @typedef Date
 * @memberOf! people(v1)
 * @type object
 * @property {integer} year Year of date. Must be from 1 to 9999, or 0 if specifying a date without a year.
 * @property {integer} month Month of year. Must be from 1 to 12.
 * @property {integer} day Day of month. Must be from 1 to 31 and valid for the year and month, or 0 if specifying a year/month where the day is not significant.
 */
/**
 * @typedef Event
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the event.
 * @property {people(v1).Date} date The date of the event.
 * @property {string} type The type of the event. The type can be custom or predefined. Possible values include, but are not limited to, the following: * `anniversary` * `other`
 * @property {string} formattedType The read-only type of the event translated and formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 */
/**
 * @typedef Address
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the address.
 * @property {string} formattedValue The read-only value of the address formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 * @property {string} type The type of the address. The type can be custom or predefined. Possible values include, but are not limited to, the following: * `home` * `work` * `other`
 * @property {string} formattedType The read-only type of the address translated and formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 * @property {string} poBox The P.O. box of the address.
 * @property {string} streetAddress The street address.
 * @property {string} extendedAddress The extended address of the address; for example, the apartment number.
 * @property {string} city The city of the address.
 * @property {string} region The region of the address; for example, the state or province.
 * @property {string} postalCode The postal code of the address.
 * @property {string} country The country of the address.
 * @property {string} countryCode The [ISO 3166-1 alpha-2](http://www.iso.org/iso/country_codes.htm) country code of the address.
 */
/**
 * @typedef Residence
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the residence.
 * @property {string} value The address of the residence.
 * @property {boolean} current True if the residence is the person&#39;s current residence; false if the residence is a past residence.
 */
/**
 * @typedef EmailAddress
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the email address.
 * @property {string} value The email address.
 * @property {string} type The type of the email address. The type can be custom or predefined. Possible values include, but are not limited to, the following: * `home` * `work` * `other`
 * @property {string} formattedType The read-only type of the email address translated and formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 */
/**
 * @typedef PhoneNumber
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the phone number.
 * @property {string} value The phone number.
 * @property {string} canonicalForm The read-only canonicalized [ITU-T E.164](https://law.resource.org/pub/us/cfr/ibr/004/itu-t.E.164.1.2008.pdf) form of the phone number.
 * @property {string} type The type of the phone number. The type can be custom or predefined. Possible values include, but are not limited to, the following: * `home` * `work` * `mobile` * `homeFax` * `workFax` * `otherFax` * `pager` * `workMobile` * `workPager` * `main` * `googleVoice` * `other`
 * @property {string} formattedType The read-only type of the phone number translated and formatted in the viewer&#39;s account locale or the the `Accept-Language` HTTP header locale.
 */
/**
 * @typedef ImClient
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the IM client.
 * @property {string} username The user name used in the IM client.
 * @property {string} type The type of the IM client. The type can be custom or predefined. Possible values include, but are not limited to, the following: * `home` * `work` * `other`
 * @property {string} formattedType The read-only type of the IM client translated and formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 * @property {string} protocol The protocol of the IM client. The protocol can be custom or predefined. Possible values include, but are not limited to, the following: * `aim` * `msn` * `yahoo` * `skype` * `qq` * `googleTalk` * `icq` * `jabber` * `netMeeting`
 * @property {string} formattedProtocol The read-only protocol of the IM client formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 */
/**
 * @typedef Tagline
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the tagline.
 * @property {string} value The tagline.
 */
/**
 * @typedef Biography
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the biography.
 * @property {string} value The short biography.
 */
/**
 * @typedef Url
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the URL.
 * @property {string} value The URL.
 * @property {string} type The type of the URL. The type can be custom or predefined. Possible values include, but are not limited to, the following: * `home` * `work` * `blog` * `profile` * `homePage` * `ftp` * `reservations` * `appInstallPage`: website for a Google+ application. * `other`
 * @property {string} formattedType The read-only type of the URL translated and formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 */
/**
 * @typedef Organization
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the organization.
 * @property {string} type The type of the organization. The type can be custom or predefined. Possible values include, but are not limited to, the following: * `work` * `school`
 * @property {string} formattedType The read-only type of the organization translated and formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 * @property {people(v1).Date} startDate The start date when the person joined the organization.
 * @property {people(v1).Date} endDate The end date when the person left the organization.
 * @property {boolean} current True if the organization is the person&#39;s current organization; false if the organization is a past organization.
 * @property {string} name The name of the organization.
 * @property {string} phoneticName The phonetic name of the organization.
 * @property {string} department The person&#39;s department at the organization.
 * @property {string} title The person&#39;s job title at the organization.
 * @property {string} jobDescription The person&#39;s job description at the organization.
 * @property {string} symbol The symbol associated with the organization; for example, a stock ticker symbol, abbreviation, or acronym.
 * @property {string} domain The domain name associated with the organization; for example, `google.com`.
 * @property {string} location The location of the organization office the person works at.
 */
/**
 * @typedef Occupation
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the occupation.
 * @property {string} value The occupation; for example, `carpenter`.
 */
/**
 * @typedef Interest
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the interest.
 * @property {string} value The interest; for example, `stargazing`.
 */
/**
 * @typedef Skill
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the skill.
 * @property {string} value The skill; for example, `underwater basket weaving`.
 */
/**
 * @typedef BraggingRights
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the bragging rights.
 * @property {string} value The bragging rights; for example, `climbed mount everest`.
 */
/**
 * @typedef Relation
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the relation.
 * @property {string} person The name of the other person this relation refers to.
 * @property {string} type The person&#39;s relation to the other person. The type can be custom or predefined. Possible values include, but are not limited to, the following values: * `spouse` * `child` * `mother` * `father` * `parent` * `brother` * `sister` * `friend` * `relative` * `domesticPartner` * `manager` * `assistant` * `referredBy` * `partner`
 * @property {string} formattedType The type of the relation translated and formatted in the viewer&#39;s account locale or the locale specified in the Accept-Language HTTP header.
 */
/**
 * @typedef RelationshipInterest
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the relationship interest.
 * @property {string} value The kind of relationship the person is looking for. The value can be custom or predefined. Possible values include, but are not limited to, the following values: * `friend` * `date` * `relationship` * `networking`
 * @property {string} formattedValue The value of the relationship interest translated and formatted in the viewer&#39;s account locale or the locale specified in the Accept-Language HTTP header.
 */
/**
 * @typedef RelationshipStatus
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the relationship status.
 * @property {string} value The relationship status. The value can be custom or predefined. Possible values include, but are not limited to, the following: * `single` * `inARelationship` * `engaged` * `married` * `itsComplicated` * `openRelationship` * `widowed` * `inDomesticPartnership` * `inCivilUnion`
 * @property {string} formattedValue The read-only value of the relationship status translated and formatted in the viewer&#39;s account locale or the `Accept-Language` HTTP header locale.
 */
/**
 * @typedef Membership
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).FieldMetadata} metadata Metadata about the membership.
 * @property {people(v1).ContactGroupMembership} contactGroupMembership The contact group membership.
 * @property {people(v1).DomainMembership} domainMembership The domain membership.
 */
/**
 * @typedef ContactGroupMembership
 * @memberOf! people(v1)
 * @type object
 * @property {string} contactGroupId The contact group ID for the contact group membership. The contact group ID can be custom or predefined. Possible values include, but are not limited to, the following: * `myContacts` * `starred` * A numerical ID for user-created groups.
 */
/**
 * @typedef DomainMembership
 * @memberOf! people(v1)
 * @type object
 * @property {boolean} inViewerDomain True if the person is in the viewer&#39;s Google Apps domain.
 */
/**
 * @typedef GetPeopleResponse
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).PersonResponse[]} responses The response for each requested resource name.
 */
/**
 * @typedef PersonResponse
 * @memberOf! people(v1)
 * @type object
 * @property {integer} httpStatusCode [HTTP 1.1 status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).
 * @property {people(v1).Person} person The person.
 * @property {string} requestedResourceName The original requested resource name. May be different than the resource name on the returned person. The resource name can change when adding or removing fields that link a contact and profile such as a verified email, verified phone number, or a profile URL.
 */
/**
 * @typedef ListConnectionsResponse
 * @memberOf! people(v1)
 * @type object
 * @property {people(v1).Person[]} connections The list of people that the requestor is connected to.
 * @property {string} nextPageToken The token that can be used to retrieve the next page of results.
 * @property {string} nextSyncToken The token that can be used to retrieve changes since the last request.
 */
module.exports = People;
