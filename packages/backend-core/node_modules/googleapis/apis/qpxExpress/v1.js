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
 * QPX Express API
 *
 * Finds the least expensive flights between an origin and a destination.
 *
 * @example
 * var google = require('googleapis');
 * var qpxExpress = google.qpxExpress('v1');
 *
 * @namespace qpxExpress
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Qpxexpress
 */
function Qpxexpress(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.trips = {

    /**
     * qpxExpress.trips.search
     *
     * @desc Returns a list of flights.
     *
     * @alias qpxExpress.trips.search
     * @memberOf! qpxExpress(v1)
     *
     * @param {object} params Parameters for request
     * @param {qpxExpress(v1).TripsSearchRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/qpxExpress/v1/trips/search',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AircraftData
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} code The aircraft code. For example, for a Boeing 777 the code would be 777.
 * @property {string} kind Identifies this as an aircraftData object. Value: the fixed string qpxexpress#aircraftData
 * @property {string} name The name of an aircraft, for example Boeing 777.
 */
/**
 * @typedef AirportData
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} city The city code an airport is located in. For example, for JFK airport, this is NYC.
 * @property {string} code An airport&#39;s code. For example, for Boston Logan airport, this is BOS.
 * @property {string} kind Identifies this as an airport object. Value: the fixed string qpxexpress#airportData.
 * @property {string} name The name of an airport. For example, for airport BOS the name is &quot;Boston Logan International&quot;.
 */
/**
 * @typedef BagDescriptor
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} commercialName Provides the commercial name for an optional service.
 * @property {integer} count How many of this type of bag will be checked on this flight.
 * @property {string[]} description A description of the baggage.
 * @property {string} kind Identifies this as a baggage object. Value: the fixed string qpxexpress#bagDescriptor.
 * @property {string} subcode The standard IATA subcode used to identify this optional service.
 */
/**
 * @typedef CarrierData
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} code The IATA designator of a carrier (airline, etc). For example, for American Airlines, the code is AA.
 * @property {string} kind Identifies this as a kind of carrier (ie. an airline, bus line, railroad, etc). Value: the fixed string qpxexpress#carrierData.
 * @property {string} name The long, full name of a carrier. For example: American Airlines.
 */
/**
 * @typedef CityData
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} code The IATA character ID of a city. For example, for Boston this is BOS.
 * @property {string} country The two-character country code of the country the city is located in. For example, US for the United States of America.
 * @property {string} kind Identifies this as a city, typically with one or more airports. Value: the fixed string qpxexpress#cityData.
 * @property {string} name The full name of a city. An example would be: New York.
 */
/**
 * @typedef Data
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {qpxExpress(v1).AircraftData[]} aircraft The aircraft that is flying between an origin and destination.
 * @property {qpxExpress(v1).AirportData[]} airport The airport of an origin or destination.
 * @property {qpxExpress(v1).CarrierData[]} carrier The airline carrier of the aircraft flying between an origin and destination. Allowed values are IATA carrier codes.
 * @property {qpxExpress(v1).CityData[]} city The city that is either the origin or destination of part of a trip.
 * @property {string} kind Identifies this as QPX Express response resource, including a trip&#39;s airport, city, taxes, airline, and aircraft. Value: the fixed string qpxexpress#data.
 * @property {qpxExpress(v1).TaxData[]} tax The taxes due for flying between an origin and a destination.
 */
/**
 * @typedef FareInfo
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} basisCode 
 * @property {string} carrier The carrier of the aircraft or other vehicle commuting between two points.
 * @property {string} destination The city code of the city the trip ends at.
 * @property {string} id A unique identifier of the fare.
 * @property {string} kind Identifies this as a fare object. Value: the fixed string qpxexpress#fareInfo.
 * @property {string} origin The city code of the city the trip begins at.
 * @property {boolean} private Whether this is a private fare, for example one offered only to select customers rather than the general public.
 */
/**
 * @typedef FlightInfo
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} carrier 
 * @property {string} number The flight number.
 */
/**
 * @typedef FreeBaggageAllowance
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {qpxExpress(v1).BagDescriptor[]} bagDescriptor A representation of a type of bag, such as an ATPCo subcode, Commercial Name, or other description.
 * @property {integer} kilos The maximum number of kilos all the free baggage together may weigh.
 * @property {integer} kilosPerPiece The maximum number of kilos any one piece of baggage may weigh.
 * @property {string} kind Identifies this as free baggage object, allowed on one segment of a trip. Value: the fixed string qpxexpress#freeBaggageAllowance.
 * @property {integer} pieces The number of free pieces of baggage allowed.
 * @property {integer} pounds The number of pounds of free baggage allowed.
 */
/**
 * @typedef LegInfo
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} aircraft The aircraft (or bus, ferry, railcar, etc) travelling between the two points of this leg.
 * @property {string} arrivalTime The scheduled time of arrival at the destination of the leg, local to the point of arrival.
 * @property {boolean} changePlane Whether you have to change planes following this leg. Only applies to the next leg.
 * @property {integer} connectionDuration Duration of a connection following this leg, in minutes.
 * @property {string} departureTime The scheduled departure time of the leg, local to the point of departure.
 * @property {string} destination The leg destination as a city and airport.
 * @property {string} destinationTerminal The terminal the flight is scheduled to arrive at.
 * @property {integer} duration The scheduled travelling time from the origin to the destination.
 * @property {string} id An identifier that uniquely identifies this leg in the solution.
 * @property {string} kind Identifies this as a leg object. A leg is the smallest unit of travel, in the case of a flight a takeoff immediately followed by a landing at two set points on a particular carrier with a particular flight number. Value: the fixed string qpxexpress#legInfo.
 * @property {string} meal A simple, general description of the meal(s) served on the flight, for example: &quot;Hot meal&quot;.
 * @property {integer} mileage The number of miles in this leg.
 * @property {integer} onTimePerformance In percent, the published on time performance on this leg.
 * @property {string} operatingDisclosure Department of Transportation disclosure information on the actual operator of a flight in a code share. (A code share refers to a marketing agreement between two carriers, where one carrier will list in its schedules (and take bookings for) flights that are actually operated by another carrier.)
 * @property {string} origin The leg origin as a city and airport.
 * @property {string} originTerminal The terminal the flight is scheduled to depart from.
 * @property {boolean} secure Whether passenger information must be furnished to the United States Transportation Security Administration (TSA) prior to departure.
 */
/**
 * @typedef PassengerCounts
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {integer} adultCount The number of passengers that are adults.
 * @property {integer} childCount The number of passengers that are children.
 * @property {integer} infantInLapCount The number of passengers that are infants travelling in the lap of an adult.
 * @property {integer} infantInSeatCount The number of passengers that are infants each assigned a seat.
 * @property {string} kind Identifies this as a passenger count object, representing the number of passengers. Value: the fixed string qpxexpress#passengerCounts.
 * @property {integer} seniorCount The number of passengers that are senior citizens.
 */
/**
 * @typedef PricingInfo
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} baseFareTotal The total fare in the base fare currency (the currency of the country of origin). This element is only present when the sales currency and the currency of the country of commencement are different.
 * @property {qpxExpress(v1).FareInfo[]} fare The fare used to price one or more segments.
 * @property {string} fareCalculation The horizontal fare calculation. This is a field on a ticket that displays all of the relevant items that go into the calculation of the fare.
 * @property {string} kind Identifies this as a pricing object, representing the price of one or more travel segments. Value: the fixed string qpxexpress#pricingInfo.
 * @property {string} latestTicketingTime The latest ticketing time for this pricing assuming the reservation occurs at ticketing time and there is no change in fares/rules. The time is local to the point of sale (POS).
 * @property {qpxExpress(v1).PassengerCounts} passengers The number of passengers to which this price applies.
 * @property {string} ptc The passenger type code for this pricing. An alphanumeric code used by a carrier to restrict fares to certain categories of passenger. For instance, a fare might be valid only for senior citizens.
 * @property {boolean} refundable Whether the fares on this pricing are refundable.
 * @property {string} saleFareTotal The total fare in the sale or equivalent currency.
 * @property {string} saleTaxTotal The taxes in the sale or equivalent currency.
 * @property {string} saleTotal Total per-passenger price (fare and tax) in the sale or equivalent currency.
 * @property {qpxExpress(v1).SegmentPricing[]} segmentPricing The per-segment price and baggage information.
 * @property {qpxExpress(v1).TaxInfo[]} tax The taxes used to calculate the tax total per ticket.
 */
/**
 * @typedef SegmentInfo
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} bookingCode The booking code or class for this segment.
 * @property {integer} bookingCodeCount The number of seats available in this booking code on this segment.
 * @property {string} cabin The cabin booked for this segment.
 * @property {integer} connectionDuration In minutes, the duration of the connection following this segment.
 * @property {integer} duration The duration of the flight segment in minutes.
 * @property {qpxExpress(v1).FlightInfo} flight The flight this is a segment of.
 * @property {string} id An id uniquely identifying the segment in the solution.
 * @property {string} kind Identifies this as a segment object. A segment is one or more consecutive legs on the same flight. For example a hypothetical flight ZZ001, from DFW to OGG, could have one segment with two legs: DFW to HNL (leg 1), HNL to OGG (leg 2). Value: the fixed string qpxexpress#segmentInfo.
 * @property {qpxExpress(v1).LegInfo[]} leg The legs composing this segment.
 * @property {string} marriedSegmentGroup The solution-based index of a segment in a married segment group. Married segments can only be booked together. For example, an airline might report a certain booking code as sold out from Boston to Pittsburgh, but as available as part of two married segments Boston to Chicago connecting through Pittsburgh. For example content of this field, consider the round-trip flight ZZ1 PHX-PHL ZZ2 PHL-CLT ZZ3 CLT-PHX. This has three segments, with the two outbound ones (ZZ1 ZZ2) married. In this case, the two outbound segments belong to married segment group 0, and the return segment belongs to married segment group 1.
 * @property {boolean} subjectToGovernmentApproval Whether the operation of this segment remains subject to government approval.
 */
/**
 * @typedef SegmentPricing
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} fareId A segment identifier unique within a single solution. It is used to refer to different parts of the same solution.
 * @property {qpxExpress(v1).FreeBaggageAllowance[]} freeBaggageOption Details of the free baggage allowance on this segment.
 * @property {string} kind Identifies this as a segment pricing object, representing the price of this segment. Value: the fixed string qpxexpress#segmentPricing.
 * @property {string} segmentId Unique identifier in the response of this segment.
 */
/**
 * @typedef SliceInfo
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {integer} duration The duration of the slice in minutes.
 * @property {string} kind Identifies this as a slice object. A slice represents a traveller&#39;s intent, the portion of a low-fare search corresponding to a traveler&#39;s request to get between two points. One-way journeys are generally expressed using 1 slice, round-trips using 2. Value: the fixed string qpxexpress#sliceInfo.
 * @property {qpxExpress(v1).SegmentInfo[]} segment The segment(s) constituting the slice.
 */
/**
 * @typedef SliceInput
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} alliance Slices with only the carriers in this alliance should be returned; do not use this field with permittedCarrier. Allowed values are ONEWORLD, SKYTEAM, and STAR.
 * @property {string} date Departure date in YYYY-MM-DD format.
 * @property {string} destination Airport or city IATA designator of the destination.
 * @property {string} kind Identifies this as a slice input object, representing the criteria a desired slice must satisfy. Value: the fixed string qpxexpress#sliceInput.
 * @property {integer} maxConnectionDuration The longest connection between two legs, in minutes, you are willing to accept.
 * @property {integer} maxStops The maximum number of stops you are willing to accept in this slice.
 * @property {string} origin Airport or city IATA designator of the origin.
 * @property {string[]} permittedCarrier A list of 2-letter IATA airline designators. Slices with only these carriers should be returned.
 * @property {qpxExpress(v1).TimeOfDayRange} permittedDepartureTime Slices must depart in this time of day range, local to the point of departure.
 * @property {string} preferredCabin Prefer solutions that book in this cabin for this slice. Allowed values are COACH, PREMIUM_COACH, BUSINESS, and FIRST.
 * @property {string[]} prohibitedCarrier A list of 2-letter IATA airline designators. Exclude slices that use these carriers.
 */
/**
 * @typedef TaxData
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} id An identifier uniquely identifying a tax in a response.
 * @property {string} kind Identifies this as a tax data object, representing some tax. Value: the fixed string qpxexpress#taxData.
 * @property {string} name The name of a tax.
 */
/**
 * @typedef TaxInfo
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} chargeType Whether this is a government charge or a carrier surcharge.
 * @property {string} code The code to enter in the ticket&#39;s tax box.
 * @property {string} country For government charges, the country levying the charge.
 * @property {string} id Identifier uniquely identifying this tax in a response. Not present for unnamed carrier surcharges.
 * @property {string} kind Identifies this as a tax information object. Value: the fixed string qpxexpress#taxInfo.
 * @property {string} salePrice The price of the tax in the sales or equivalent currency.
 */
/**
 * @typedef TimeOfDayRange
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} earliestTime The earliest time of day in HH:MM format.
 * @property {string} kind Identifies this as a time of day range object, representing two times in a single day defining a time range. Value: the fixed string qpxexpress#timeOfDayRange.
 * @property {string} latestTime The latest time of day in HH:MM format.
 */
/**
 * @typedef TripOption
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} id Identifier uniquely identifying this trip in a response.
 * @property {string} kind Identifies this as a trip information object. Value: the fixed string qpxexpress#tripOption.
 * @property {qpxExpress(v1).PricingInfo[]} pricing Per passenger pricing information.
 * @property {string} saleTotal The total price for all passengers on the trip, in the form of a currency followed by an amount, e.g. USD253.35.
 * @property {qpxExpress(v1).SliceInfo[]} slice The slices that make up this trip&#39;s itinerary.
 */
/**
 * @typedef TripOptionsRequest
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} maxPrice Do not return solutions that cost more than this price. The alphabetical part of the price is in ISO 4217. The format, in regex, is [A-Z]{3}\d+(\.\d+)? Example: $102.07
 * @property {qpxExpress(v1).PassengerCounts} passengers Counts for each passenger type in the request.
 * @property {boolean} refundable Return only solutions with refundable fares.
 * @property {string} saleCountry IATA country code representing the point of sale. This determines the &quot;equivalent amount paid&quot; currency for the ticket.
 * @property {qpxExpress(v1).SliceInput[]} slice The slices that make up the itinerary of this trip. A slice represents a traveler&#39;s intent, the portion of a low-fare search corresponding to a traveler&#39;s request to get between two points. One-way journeys are generally expressed using one slice, round-trips using two. An example of a one slice trip with three segments might be BOS-SYD, SYD-LAX, LAX-BOS if the traveler only stopped in SYD and LAX just long enough to change planes.
 * @property {integer} solutions The number of solutions to return, maximum 500.
 * @property {string} ticketingCountry IATA country code representing the point of ticketing.
 */
/**
 * @typedef TripOptionsResponse
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {qpxExpress(v1).Data} data Informational data global to list of solutions.
 * @property {string} kind Identifies this as a QPX Express trip response object, which consists of zero or more solutions. Value: the fixed string qpxexpress#tripOptions.
 * @property {string} requestId An identifier uniquely identifying this response.
 * @property {qpxExpress(v1).TripOption[]} tripOption A list of priced itinerary solutions to the QPX Express query.
 */
/**
 * @typedef TripsSearchRequest
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {qpxExpress(v1).TripOptionsRequest} request A QPX Express search request. Required values are at least one adult or senior passenger, an origin, a destination, and a date.
 */
/**
 * @typedef TripsSearchResponse
 * @memberOf! qpxExpress(v1)
 * @type object
 * @property {string} kind Identifies this as a QPX Express API search response resource. Value: the fixed string qpxExpress#tripsSearch.
 * @property {qpxExpress(v1).TripOptionsResponse} trips All possible solutions to the QPX Express search request.
 */
module.exports = Qpxexpress;
