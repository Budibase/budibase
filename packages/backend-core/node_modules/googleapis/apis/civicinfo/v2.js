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
 * Google Civic Information API
 *
 * Provides polling places, early vote locations, contest data, election officials, and government representatives for U.S. residential addresses.
 *
 * @example
 * var google = require('googleapis');
 * var civicinfo = google.civicinfo('v2');
 *
 * @namespace civicinfo
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Civicinfo
 */
function Civicinfo(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.divisions = {

    /**
     * civicinfo.divisions.search
     *
     * @desc Searches for political divisions by their natural name or OCD ID.
     *
     * @alias civicinfo.divisions.search
     * @memberOf! civicinfo(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.query The search query. Queries can cover any parts of a OCD ID or a human readable division name. All words given in the query are treated as required patterns. In addition to that, most query operators of the Apache Lucene library are supported. See http://lucene.apache.org/core/2_9_4/queryparsersyntax.html
     * @param {civicinfo(v2).DivisionSearchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    search: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/civicinfo/v2/divisions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.elections = {

    /**
     * civicinfo.elections.electionQuery
     *
     * @desc List of available elections to query.
     *
     * @alias civicinfo.elections.electionQuery
     * @memberOf! civicinfo(v2)
     *
     * @param {object} params Parameters for request
     * @param {civicinfo(v2).ElectionsQueryRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    electionQuery: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/civicinfo/v2/elections',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * civicinfo.elections.voterInfoQuery
     *
     * @desc Looks up information relevant to a voter based on the voter's registered address.
     *
     * @alias civicinfo.elections.voterInfoQuery
     * @memberOf! civicinfo(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.address The registered address of the voter to look up.
     * @param {string=} params.electionId The unique ID of the election to look up. A list of election IDs can be obtained at https://www.googleapis.com/civicinfo/{version}/elections
     * @param {boolean=} params.officialOnly If set to true, only data from official state sources will be returned.
     * @param {boolean=} params.returnAllAvailableData If set to true, the query will return the success codeand include any partial information when it is unable to determine a matching address or unable to determine the election for electionId=0 queries.
     * @param {civicinfo(v2).VoterInfoRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    voterInfoQuery: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/civicinfo/v2/voterinfo',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['address'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.representatives = {

    /**
     * civicinfo.representatives.representativeInfoByAddress
     *
     * @desc Looks up political geography and representative information for a single address.
     *
     * @alias civicinfo.representatives.representativeInfoByAddress
     * @memberOf! civicinfo(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.address The address to look up. May only be specified if the field ocdId is not given in the URL.
     * @param {boolean=} params.includeOffices Whether to return information about offices and officials. If false, only the top-level district information will be returned.
     * @param {string=} params.levels A list of office levels to filter by. Only offices that serve at least one of these levels will be returned. Divisions that don't contain a matching office will not be returned.
     * @param {string=} params.roles A list of office roles to filter by. Only offices fulfilling one of these roles will be returned. Divisions that don't contain a matching office will not be returned.
     * @param {civicinfo(v2).RepresentativeInfoRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    representativeInfoByAddress: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/civicinfo/v2/representatives',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * civicinfo.representatives.representativeInfoByDivision
     *
     * @desc Looks up representative information for a single geographic division.
     *
     * @alias civicinfo.representatives.representativeInfoByDivision
     * @memberOf! civicinfo(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.levels A list of office levels to filter by. Only offices that serve at least one of these levels will be returned. Divisions that don't contain a matching office will not be returned.
     * @param {string} params.ocdId The Open Civic Data division identifier of the division to look up.
     * @param {boolean=} params.recursive If true, information about all divisions contained in the division requested will be included as well. For example, if querying ocd-division/country:us/district:dc, this would also return all DC's wards and ANCs.
     * @param {string=} params.roles A list of office roles to filter by. Only offices fulfilling one of these roles will be returned. Divisions that don't contain a matching office will not be returned.
     * @param {civicinfo(v2).DivisionRepresentativeInfoRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    representativeInfoByDivision: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/civicinfo/v2/representatives/{ocdId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['ocdId'],
        pathParams: ['ocdId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AdministrationRegion
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).AdministrativeBody} electionAdministrationBody The election administration body for this area.
 * @property {string} id An ID for this object. IDs may change in future requests and should not be cached. Access to this field requires special access that can be requested from the Request more link on the Quotas page.
 * @property {civicinfo(v2).AdministrationRegion} local_jurisdiction The city or county that provides election information for this voter. This object can have the same elements as state.
 * @property {string} name The name of the jurisdiction.
 * @property {civicinfo(v2).Source[]} sources A list of sources for this area. If multiple sources are listed the data has been aggregated from those sources.
 */
/**
 * @typedef AdministrativeBody
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} absenteeVotingInfoUrl A URL provided by this administrative body for information on absentee voting.
 * @property {string[]} addressLines 
 * @property {string} ballotInfoUrl A URL provided by this administrative body to give contest information to the voter.
 * @property {civicinfo(v2).SimpleAddressType} correspondenceAddress The mailing address of this administrative body.
 * @property {string} electionInfoUrl A URL provided by this administrative body for looking up general election information.
 * @property {civicinfo(v2).ElectionOfficial[]} electionOfficials The election officials for this election administrative body.
 * @property {string} electionRegistrationConfirmationUrl A URL provided by this administrative body for confirming that the voter is registered to vote.
 * @property {string} electionRegistrationUrl A URL provided by this administrative body for looking up how to register to vote.
 * @property {string} electionRulesUrl A URL provided by this administrative body describing election rules to the voter.
 * @property {string} hoursOfOperation A description of the hours of operation for this administrative body.
 * @property {string} name The name of this election administrative body.
 * @property {civicinfo(v2).SimpleAddressType} physicalAddress The physical address of this administrative body.
 * @property {string[]} voter_services A description of the services this administrative body may provide.
 * @property {string} votingLocationFinderUrl A URL provided by this administrative body for looking up where to vote.
 */
/**
 * @typedef Candidate
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} candidateUrl The URL for the candidate&#39;s campaign web site.
 * @property {civicinfo(v2).Channel[]} channels A list of known (social) media channels for this candidate.
 * @property {string} email The email address for the candidate&#39;s campaign.
 * @property {string} name The candidate&#39;s name. If this is a joint ticket it will indicate the name of the candidate at the top of a ticket followed by a / and that name of candidate at the bottom of the ticket. e.g. &quot;Mitt Romney / Paul Ryan&quot;
 * @property {string} orderOnBallot The order the candidate appears on the ballot for this contest.
 * @property {string} party The full name of the party the candidate is a member of.
 * @property {string} phone The voice phone number for the candidate&#39;s campaign office.
 * @property {string} photoUrl A URL for a photo of the candidate.
 */
/**
 * @typedef Channel
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} id The unique public identifier for the candidate&#39;s channel.
 * @property {string} type The type of channel. The following is a list of types of channels, but is not exhaustive. More channel types may be added at a later time. One of: GooglePlus, YouTube, Facebook, Twitter
 */
/**
 * @typedef Contest
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} ballotPlacement A number specifying the position of this contest on the voter&#39;s ballot.
 * @property {civicinfo(v2).Candidate[]} candidates The candidate choices for this contest.
 * @property {civicinfo(v2).ElectoralDistrict} district Information about the electoral district that this contest is in.
 * @property {string} electorateSpecifications A description of any additional eligibility requirements for voting in this contest.
 * @property {string} id An ID for this object. IDs may change in future requests and should not be cached. Access to this field requires special access that can be requested from the Request more link on the Quotas page.
 * @property {string[]} level The levels of government of the office for this contest. There may be more than one in cases where a jurisdiction effectively acts at two different levels of government; for example, the mayor of the District of Columbia acts at &quot;locality&quot; level, but also effectively at both &quot;administrative-area-2&quot; and &quot;administrative-area-1&quot;.
 * @property {string} numberElected The number of candidates that will be elected to office in this contest.
 * @property {string} numberVotingFor The number of candidates that a voter may vote for in this contest.
 * @property {string} office The name of the office for this contest.
 * @property {string} primaryParty If this is a partisan election, the name of the party it is for.
 * @property {string[]} referendumBallotResponses The set of ballot responses for the referendum. A ballot response represents a line on the ballot. Common examples might include &quot;yes&quot; or &quot;no&quot; for referenda. This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string} referendumBrief Specifies a short summary of the referendum that is typically on the ballot below the title but above the text. This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string} referendumConStatement A statement in opposition to the referendum. It does not necessarily appear on the ballot. This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string} referendumEffectOfAbstain Specifies what effect abstaining (not voting) on the proposition will have (i.e. whether abstaining is considered a vote against it). This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string} referendumPassageThreshold The threshold of votes that the referendum needs in order to pass, e.g. &quot;two-thirds&quot;. This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string} referendumProStatement A statement in favor of the referendum. It does not necessarily appear on the ballot. This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string} referendumSubtitle A brief description of the referendum. This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string} referendumText The full text of the referendum. This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string} referendumTitle The title of the referendum (e.g. &#39;Proposition 42&#39;). This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string} referendumUrl A link to the referendum. This field is only populated for contests of type &#39;Referendum&#39;.
 * @property {string[]} roles The roles which this office fulfills.
 * @property {civicinfo(v2).Source[]} sources A list of sources for this contest. If multiple sources are listed, the data has been aggregated from those sources.
 * @property {string} special &quot;Yes&quot; or &quot;No&quot; depending on whether this a contest being held outside the normal election cycle.
 * @property {string} type The type of contest. Usually this will be &#39;General&#39;, &#39;Primary&#39;, or &#39;Run-off&#39; for contests with candidates. For referenda this will be &#39;Referendum&#39;. For Retention contests this will typically be &#39;Retention&#39;.
 */
/**
 * @typedef ContextParams
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} clientProfile 
 */
/**
 * @typedef DivisionRepresentativeInfoRequest
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).ContextParams} contextParams 
 */
/**
 * @typedef DivisionSearchRequest
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).ContextParams} contextParams 
 */
/**
 * @typedef DivisionSearchResponse
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;civicinfo#divisionSearchResponse&quot;.
 * @property {civicinfo(v2).DivisionSearchResult[]} results 
 */
/**
 * @typedef DivisionSearchResult
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string[]} aliases Other Open Civic Data identifiers that refer to the same division -- for example, those that refer to other political divisions whose boundaries are defined to be coterminous with this one. For example, ocd-division/country:us/state:wy will include an alias of ocd-division/country:us/state:wy/cd:1, since Wyoming has only one Congressional district.
 * @property {string} name The name of the division.
 * @property {string} ocdId The unique Open Civic Data identifier for this division.
 */
/**
 * @typedef Election
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} electionDay Day of the election in YYYY-MM-DD format.
 * @property {string} id The unique ID of this election.
 * @property {string} name A displayable name for the election.
 * @property {string} ocdDivisionId The political division of the election. Represented as an OCD Division ID. Voters within these political jurisdictions are covered by this election. This is typically a state such as ocd-division/country:us/state:ca or for the midterms or general election the entire US (i.e. ocd-division/country:us).
 */
/**
 * @typedef ElectionOfficial
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} emailAddress The email address of the election official.
 * @property {string} faxNumber The fax number of the election official.
 * @property {string} name The full name of the election official.
 * @property {string} officePhoneNumber The office phone number of the election official.
 * @property {string} title The title of the election official.
 */
/**
 * @typedef ElectionsQueryRequest
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).ContextParams} contextParams 
 */
/**
 * @typedef ElectionsQueryResponse
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).Election[]} elections A list of available elections
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;civicinfo#electionsQueryResponse&quot;.
 */
/**
 * @typedef ElectoralDistrict
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} id An identifier for this district, relative to its scope. For example, the 34th State Senate district would have id &quot;34&quot; and a scope of stateUpper.
 * @property {string} kgForeignKey 
 * @property {string} name The name of the district.
 * @property {string} scope The geographic scope of this district. If unspecified the district&#39;s geography is not known. One of: national, statewide, congressional, stateUpper, stateLower, countywide, judicial, schoolBoard, cityWide, township, countyCouncil, cityCouncil, ward, special
 */
/**
 * @typedef GeographicDivision
 * @memberOf! civicinfo(v2)
 * @type object
* @property {string[]} alsoKnownAs Any other valid OCD IDs that refer to the same division.

Because OCD IDs are meant to be human-readable and at least somewhat predictable, there are occasionally several identifiers for a single division. These identifiers are defined to be equivalent to one another, and one is always indicated as the primary identifier. The primary identifier will be returned in ocd_id above, and any other equivalent valid identifiers will be returned in this list.

For example, if this division&#39;s OCD ID is ocd-division/country:us/district:dc, this will contain ocd-division/country:us/state:dc.
* @property {string} name The name of the division.
* @property {integer[]} officeIndices List of indices in the offices array, one for each office elected from this division. Will only be present if includeOffices was true (or absent) in the request.
*/
/**
 * @typedef Office
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} divisionId The OCD ID of the division with which this office is associated.
 * @property {string[]} levels The levels of government of which this office is part. There may be more than one in cases where a jurisdiction effectively acts at two different levels of government; for example, the mayor of the District of Columbia acts at &quot;locality&quot; level, but also effectively at both &quot;administrative-area-2&quot; and &quot;administrative-area-1&quot;.
 * @property {string} name The human-readable name of the office.
 * @property {integer[]} officialIndices List of indices in the officials array of people who presently hold this office.
 * @property {string[]} roles The roles which this office fulfills. Roles are not meant to be exhaustive, or to exactly specify the entire set of responsibilities of a given office, but are meant to be rough categories that are useful for general selection from or sorting of a list of offices.
 * @property {civicinfo(v2).Source[]} sources A list of sources for this office. If multiple sources are listed, the data has been aggregated from those sources.
 */
/**
 * @typedef Official
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).SimpleAddressType[]} address Addresses at which to contact the official.
 * @property {civicinfo(v2).Channel[]} channels A list of known (social) media channels for this official.
 * @property {string[]} emails The direct email addresses for the official.
 * @property {string} name The official&#39;s name.
 * @property {string} party The full name of the party the official belongs to.
 * @property {string[]} phones The official&#39;s public contact phone numbers.
 * @property {string} photoUrl A URL for a photo of the official.
 * @property {string[]} urls The official&#39;s public website URLs.
 */
/**
 * @typedef PollingLocation
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).SimpleAddressType} address The address of the location.
 * @property {string} endDate The last date that this early vote site or drop off location may be used. This field is not populated for polling locations.
 * @property {string} id An ID for this object. IDs may change in future requests and should not be cached. Access to this field requires special access that can be requested from the Request more link on the Quotas page.
 * @property {string} name The name of the early vote site or drop off location. This field is not populated for polling locations.
 * @property {string} notes Notes about this location (e.g. accessibility ramp or entrance to use).
 * @property {string} pollingHours A description of when this location is open.
 * @property {civicinfo(v2).Source[]} sources A list of sources for this location. If multiple sources are listed the data has been aggregated from those sources.
 * @property {string} startDate The first date that this early vote site or drop off location may be used. This field is not populated for polling locations.
 * @property {string} voterServices The services provided by this early vote site or drop off location. This field is not populated for polling locations.
 */
/**
 * @typedef PostalAddress
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string[]} addressLines 
 * @property {string} administrativeAreaName 
 * @property {string} countryName 
 * @property {string} countryNameCode 
 * @property {string} dependentLocalityName 
 * @property {string} dependentThoroughfareLeadingType 
 * @property {string} dependentThoroughfareName 
 * @property {string} dependentThoroughfarePostDirection 
 * @property {string} dependentThoroughfarePreDirection 
 * @property {string} dependentThoroughfareTrailingType 
 * @property {string} dependentThoroughfaresConnector 
 * @property {string} dependentThoroughfaresIndicator 
 * @property {string} dependentThoroughfaresType 
 * @property {string} firmName 
 * @property {boolean} isDisputed 
 * @property {string} languageCode 
 * @property {string} localityName 
 * @property {string} postBoxNumber 
 * @property {string} postalCodeNumber 
 * @property {string} postalCodeNumberExtension 
 * @property {string} premiseName 
 * @property {string} recipientName 
 * @property {string} sortingCode 
 * @property {string} subAdministrativeAreaName 
 * @property {string} subPremiseName 
 * @property {string} thoroughfareLeadingType 
 * @property {string} thoroughfareName 
 * @property {string} thoroughfareNumber 
 * @property {string} thoroughfarePostDirection 
 * @property {string} thoroughfarePreDirection 
 * @property {string} thoroughfareTrailingType 
 */
/**
 * @typedef RepresentativeInfoData
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {object} divisions Political geographic divisions that contain the requested address.
 * @property {civicinfo(v2).Office[]} offices Elected offices referenced by the divisions listed above. Will only be present if includeOffices was true in the request.
 * @property {civicinfo(v2).Official[]} officials Officials holding the offices listed above. Will only be present if includeOffices was true in the request.
 */
/**
 * @typedef RepresentativeInfoRequest
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).ContextParams} contextParams 
 */
/**
 * @typedef RepresentativeInfoResponse
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {object} divisions Political geographic divisions that contain the requested address.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;civicinfo#representativeInfoResponse&quot;.
 * @property {civicinfo(v2).SimpleAddressType} normalizedInput The normalized version of the requested address
 * @property {civicinfo(v2).Office[]} offices Elected offices referenced by the divisions listed above. Will only be present if includeOffices was true in the request.
 * @property {civicinfo(v2).Official[]} officials Officials holding the offices listed above. Will only be present if includeOffices was true in the request.
 */
/**
 * @typedef SimpleAddressType
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} city The city or town for the address.
 * @property {string} line1 The street name and number of this address.
 * @property {string} line2 The second line the address, if needed.
 * @property {string} line3 The third line of the address, if needed.
 * @property {string} locationName The name of the location.
 * @property {string} state The US two letter state abbreviation of the address.
 * @property {string} zip The US Postal Zip Code of the address.
 */
/**
 * @typedef Source
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} name The name of the data source.
 * @property {boolean} official Whether this data comes from an official government source.
 */
/**
 * @typedef VoterInfoRequest
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).ContextParams} contextParams 
 * @property {civicinfo(v2).VoterInfoSegmentResult} voterInfoSegmentResult 
 */
/**
 * @typedef VoterInfoResponse
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {civicinfo(v2).Contest[]} contests Contests that will appear on the voter&#39;s ballot.
 * @property {civicinfo(v2).PollingLocation[]} dropOffLocations Locations where a voter is eligible to drop off a completed ballot. The voter must have received and completed a ballot prior to arriving at the location. The location may not have ballots available on the premises. These locations could be open on or before election day as indicated in the pollingHours field.
 * @property {civicinfo(v2).PollingLocation[]} earlyVoteSites Locations where the voter is eligible to vote early, prior to election day.
 * @property {civicinfo(v2).Election} election The election that was queried.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;civicinfo#voterInfoResponse&quot;.
 * @property {boolean} mailOnly Specifies whether voters in the precinct vote only by mailing their ballots (with the possible option of dropping off their ballots as well).
 * @property {civicinfo(v2).SimpleAddressType} normalizedInput The normalized version of the requested address
 * @property {civicinfo(v2).Election[]} otherElections If no election ID was specified in the query, and there was more than one election with data for the given voter, this will contain information about the other elections that could apply.
 * @property {civicinfo(v2).PollingLocation[]} pollingLocations Locations where the voter is eligible to vote on election day.
 * @property {string} precinctId 
 * @property {civicinfo(v2).AdministrationRegion[]} state Local Election Information for the state that the voter votes in. For the US, there will only be one element in this array.
 */
/**
 * @typedef VoterInfoSegmentResult
 * @memberOf! civicinfo(v2)
 * @type object
 * @property {string} generatedMillis 
 * @property {civicinfo(v2).PostalAddress} postalAddress 
 * @property {civicinfo(v2).VoterInfoRequest} request 
 * @property {civicinfo(v2).VoterInfoResponse} response 
 */
module.exports = Civicinfo;
