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
 * Content API for Shopping
 *
 * Manages product items, inventory, and Merchant Center accounts for Google Shopping.
 *
 * @example
 * var google = require('googleapis');
 * var content = google.content('v2sandbox');
 *
 * @namespace content
 * @type {Function}
 * @version v2sandbox
 * @variation v2sandbox
 * @param {object=} options Options for Content
 */
function Content(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.orders = {

    /**
     * content.orders.acknowledge
     *
     * @desc Marks an order as acknowledged. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.acknowledge
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2sandbox).OrdersAcknowledgeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    acknowledge: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders/{orderId}/acknowledge',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.advancetestorder
     *
     * @desc Sandbox only. Moves a test order from state "inProgress" to state "pendingShipment". This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.advancetestorder
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the test order to modify.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    advancetestorder: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/testorders/{orderId}/advance',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.cancel
     *
     * @desc Cancels all line items in an order. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.cancel
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order to cancel.
     * @param {content(v2sandbox).OrdersCancelRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    cancel: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders/{orderId}/cancel',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.cancellineitem
     *
     * @desc Cancels a line item. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.cancellineitem
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2sandbox).OrdersCancelLineItemRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    cancellineitem: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders/{orderId}/cancelLineItem',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.createtestorder
     *
     * @desc Sandbox only. Creates a test order. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.createtestorder
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2sandbox).OrdersCreateTestOrderRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    createtestorder: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/testorders',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.custombatch
     *
     * @desc Retrieves or modifies multiple orders in a single request. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.custombatch
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {content(v2sandbox).OrdersCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/orders/batch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.get
     *
     * @desc Retrieves an order from your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.get
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
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
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders/{orderId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.getbymerchantorderid
     *
     * @desc Retrieves an order using merchant order id. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.getbymerchantorderid
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.merchantOrderId The merchant order id to be looked for.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getbymerchantorderid: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/ordersbymerchantid/{merchantOrderId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'merchantOrderId'],
        pathParams: ['merchantId', 'merchantOrderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.gettestordertemplate
     *
     * @desc Sandbox only. Retrieves an order template that can be used to quickly create a new order in sandbox. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.gettestordertemplate
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.templateName The name of the template to retrieve.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    gettestordertemplate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/testordertemplates/{templateName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'templateName'],
        pathParams: ['merchantId', 'templateName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.list
     *
     * @desc Lists the orders in your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.list
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.acknowledged Obtains orders that match the acknowledgement status. When set to true, obtains orders that have been acknowledged. When false, obtains orders that have not been acknowledged. We recommend using this filter set to false, in conjunction with the acknowledge call, such that only un-acknowledged orders are returned.
     * @param {integer=} params.maxResults The maximum number of orders to return in the response, used for paging. The default value is 25 orders per page, and the maximum allowed value is 250 orders per page. Known issue: All List calls will return all Orders without limit regardless of the value of this field.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.orderBy The ordering of the returned list. The only supported value are placedDate desc and placedDate asc for now, which returns orders sorted by placement date. "placedDate desc" stands for listing orders by placement date, from oldest to most recent. "placedDate asc" stands for listing orders by placement date, from most recent to oldest. In future releases we'll support other sorting criteria.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {string=} params.placedDateEnd Obtains orders placed before this date (exclusively), in ISO 8601 format.
     * @param {string=} params.placedDateStart Obtains orders placed after this date (inclusively), in ISO 8601 format.
     * @param {string=} params.statuses Obtains orders that match any of the specified statuses. Multiple values can be specified with comma separation. Additionally, please note that active is a shortcut for pendingShipment and partiallyShipped, and completed is a shortcut for shipped , partiallyDelivered, delivered, partiallyReturned, returned, and canceled.
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
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.refund
     *
     * @desc Refund a portion of the order, up to the full amount paid. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.refund
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order to refund.
     * @param {content(v2sandbox).OrdersRefundRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    refund: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders/{orderId}/refund',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.returnlineitem
     *
     * @desc Returns a line item. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.returnlineitem
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2sandbox).OrdersReturnLineItemRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    returnlineitem: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders/{orderId}/returnLineItem',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.shiplineitems
     *
     * @desc Marks line item(s) as shipped. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.shiplineitems
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2sandbox).OrdersShipLineItemsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    shiplineitems: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders/{orderId}/shipLineItems',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.updatemerchantorderid
     *
     * @desc Updates the merchant order ID for a given order. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.updatemerchantorderid
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2sandbox).OrdersUpdateMerchantOrderIdRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updatemerchantorderid: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders/{orderId}/updateMerchantOrderId',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.updateshipment
     *
     * @desc Updates a shipment's status, carrier, and/or tracking ID. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.updateshipment
     * @memberOf! content(v2sandbox)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2sandbox).OrdersUpdateShipmentRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updateshipment: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2sandbox/{merchantId}/orders/{orderId}/updateShipment',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Error
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} domain The domain of the error.
 * @property {string} message A description of the error.
 * @property {string} reason The error code.
 */
/**
 * @typedef Errors
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {integer} code The HTTP status of the first error in errors.
 * @property {content(v2sandbox).Error[]} errors A list of errors.
 * @property {string} message The message of the first error in errors.
 */
/**
 * @typedef Order
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {boolean} acknowledged Whether the order was acknowledged.
 * @property {string} channelType The channel type of the order: &quot;purchaseOnGoogle&quot; or &quot;googleExpress&quot;.
 * @property {content(v2sandbox).OrderCustomer} customer The details of the customer who placed the order.
 * @property {content(v2sandbox).OrderDeliveryDetails} deliveryDetails The details for the delivery.
 * @property {string} id The REST id of the order. Globally unique.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#order&quot;.
 * @property {content(v2sandbox).OrderLineItem[]} lineItems Line items that are ordered.
 * @property {string} merchantId 
 * @property {string} merchantOrderId Merchant-provided id of the order.
 * @property {content(v2sandbox).Price} netAmount The net amount for the order. For example, if an order was originally for a grand total of $100 and a refund was issued for $20, the net amount will be $80.
 * @property {content(v2sandbox).OrderPaymentMethod} paymentMethod The details of the payment method.
 * @property {string} paymentStatus The status of the payment.
 * @property {string} placedDate The date when the order was placed, in ISO 8601 format.
 * @property {content(v2sandbox).OrderPromotion[]} promotions The details of the merchant provided promotions applied to the order. More details about the program are  here.
 * @property {content(v2sandbox).OrderRefund[]} refunds Refunds for the order.
 * @property {content(v2sandbox).OrderShipment[]} shipments Shipments of the order.
 * @property {content(v2sandbox).Price} shippingCost The total cost of shipping for all items.
 * @property {content(v2sandbox).Price} shippingCostTax The tax for the total shipping cost.
 * @property {string} shippingOption The requested shipping option.
 * @property {string} status The status of the order.
 */
/**
 * @typedef OrderAddress
 * @memberOf! content(v2sandbox)
 * @type object
* @property {string} country CLDR country code (e.g. &quot;US&quot;).
* @property {string[]} fullAddress Strings representing the lines of the printed label for mailing the order, for example:
John Smith
1600 Amphitheatre Parkway
Mountain View, CA, 94043
United States
* @property {boolean} isPostOfficeBox Whether the address is a post office box.
* @property {string} locality City, town or commune. May also include dependent localities or sublocalities (e.g. neighborhoods or suburbs).
* @property {string} postalCode Postal Code or ZIP (e.g. &quot;94043&quot;).
* @property {string} recipientName Name of the recipient.
* @property {string} region Top-level administrative subdivision of the country (e.g. &quot;CA&quot;).
* @property {string[]} streetAddress Street-level part of the address.
*/
/**
 * @typedef OrderCancellation
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} actor The actor that created the cancellation.
 * @property {string} creationDate Date on which the cancellation has been created, in ISO 8601 format.
 * @property {integer} quantity The quantity that was canceled.
 * @property {string} reason The reason for the cancellation. Orders that are cancelled with a noInventory reason will lead to the removal of the product from POG until you make an update to that product. This will not affect your Shopping ads.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrderCustomer
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} email Email address of the customer.
 * @property {boolean} explicitMarketingPreference If set, this indicates the user explicitly chose to opt in or out of providing marketing rights to the merchant. If unset, this indicates the user has already made this choice in a previous purchase, and was thus not shown the marketing right opt in/out checkbox during the checkout flow.
 * @property {string} fullName Full name of the customer.
 */
/**
 * @typedef OrderDeliveryDetails
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).OrderAddress} address The delivery address
 * @property {string} phoneNumber The phone number of the person receiving the delivery.
 */
/**
 * @typedef OrderLineItem
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).OrderCancellation[]} cancellations Cancellations of the line item.
 * @property {string} id The id of the line item.
 * @property {content(v2sandbox).Price} price Total price for the line item. For example, if two items for $10 are purchased, the total price will be $20.
 * @property {content(v2sandbox).OrderLineItemProduct} product Product data from the time of the order placement.
 * @property {integer} quantityCanceled Number of items canceled.
 * @property {integer} quantityDelivered Number of items delivered.
 * @property {integer} quantityOrdered Number of items ordered.
 * @property {integer} quantityPending Number of items pending.
 * @property {integer} quantityReturned Number of items returned.
 * @property {integer} quantityShipped Number of items shipped.
 * @property {content(v2sandbox).OrderLineItemReturnInfo} returnInfo Details of the return policy for the line item.
 * @property {content(v2sandbox).OrderReturn[]} returns Returns of the line item.
 * @property {content(v2sandbox).OrderLineItemShippingDetails} shippingDetails Details of the requested shipping for the line item.
 * @property {content(v2sandbox).Price} tax Total tax amount for the line item. For example, if two items are purchased, and each have a cost tax of $2, the total tax amount will be $4.
 */
/**
 * @typedef OrderLineItemProduct
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} brand Brand of the item.
 * @property {string} channel The item&#39;s channel (online or local).
 * @property {string} condition Condition or state of the item.
 * @property {string} contentLanguage The two-letter ISO 639-1 language code for the item.
 * @property {string} gtin Global Trade Item Number (GTIN) of the item.
 * @property {string} id The REST id of the product.
 * @property {string} imageLink URL of an image of the item.
 * @property {string} itemGroupId Shared identifier for all variants of the same product.
 * @property {string} mpn Manufacturer Part Number (MPN) of the item.
 * @property {string} offerId An identifier of the item.
 * @property {content(v2sandbox).Price} price Price of the item.
 * @property {string} shownImage URL to the cached image shown to the user when order was placed.
 * @property {string} targetCountry The CLDR territory code of the target country of the product.
 * @property {string} title The title of the product.
 * @property {content(v2sandbox).OrderLineItemProductVariantAttribute[]} variantAttributes Variant attributes for the item. These are dimensions of the product, such as color, gender, material, pattern, and size. You can find a comprehensive list of variant attributes here.
 */
/**
 * @typedef OrderLineItemProductVariantAttribute
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} dimension The dimension of the variant.
 * @property {string} value The value for the dimension.
 */
/**
 * @typedef OrderLineItemReturnInfo
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {integer} daysToReturn How many days later the item can be returned.
 * @property {boolean} isReturnable Whether the item is returnable.
 * @property {string} policyUrl URL of the item return policy.
 */
/**
 * @typedef OrderLineItemShippingDetails
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} deliverByDate The delivery by date, in ISO 8601 format.
 * @property {content(v2sandbox).OrderLineItemShippingDetailsMethod} method Details of the shipping method.
 * @property {string} shipByDate The ship by date, in ISO 8601 format.
 */
/**
 * @typedef OrderLineItemShippingDetailsMethod
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} carrier The carrier for the shipping. Optional.
 * @property {integer} maxDaysInTransit Maximum transit time.
 * @property {string} methodName The name of the shipping method.
 * @property {integer} minDaysInTransit Minimum transit time.
 */
/**
 * @typedef OrderPaymentMethod
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).OrderAddress} billingAddress The billing address.
 * @property {integer} expirationMonth The card expiration month (January = 1, February = 2 etc.).
 * @property {integer} expirationYear The card expiration year (4-digit, e.g. 2015).
 * @property {string} lastFourDigits The last four digits of the card number.
 * @property {string} phoneNumber The billing phone number.
 * @property {string} type The type of instrument (VISA, Mastercard, etc).
 */
/**
 * @typedef OrderPromotion
 * @memberOf! content(v2sandbox)
 * @type object
* @property {content(v2sandbox).OrderPromotionBenefit[]} benefits 
* @property {string} effectiveDates The date and time frame when the promotion is active and ready for validation review. Note that the promotion live time may be delayed for a few hours due to the validation review.
Start date and end date are separated by a forward slash (/). The start date is specified by the format (YYYY-MM-DD), followed by the letter ?T?, the time of the day when the sale starts (in Greenwich Mean Time, GMT), followed by an expression of the time zone for the sale. The end date is in the same format.
* @property {string} genericRedemptionCode Optional. The text code that corresponds to the promotion when applied on the retailer?s website.
* @property {string} id The unique ID of the promotion.
* @property {string} longTitle The full title of the promotion.
* @property {string} productApplicability Whether the promotion is applicable to all products or only specific products.
* @property {string} redemptionChannel Indicates that the promotion is valid online.
*/
/**
 * @typedef OrderPromotionBenefit
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).Price} discount The discount in the order price when the promotion is applied.
 * @property {string[]} offerIds The OfferId(s) that were purchased in this order and map to this specific benefit of the promotion.
 * @property {string} subType Further describes the benefit of the promotion. Note that we will expand on this enumeration as we support new promotion sub-types.
 * @property {content(v2sandbox).Price} taxImpact The impact on tax when the promotion is applied.
 * @property {string} type Describes whether the promotion applies to products (e.g. 20% off) or to shipping (e.g. Free Shipping).
 */
/**
 * @typedef OrderRefund
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} actor The actor that created the refund.
 * @property {content(v2sandbox).Price} amount The amount that is refunded.
 * @property {string} creationDate Date on which the item has been created, in ISO 8601 format.
 * @property {string} reason The reason for the refund.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrderReturn
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} actor The actor that created the refund.
 * @property {string} creationDate Date on which the item has been created, in ISO 8601 format.
 * @property {integer} quantity Quantity that is returned.
 * @property {string} reason The reason for the return.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrderShipment
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} carrier The carrier handling the shipment.
 * @property {string} creationDate Date on which the shipment has been created, in ISO 8601 format.
 * @property {string} deliveryDate Date on which the shipment has been delivered, in ISO 8601 format. Present only if status is delievered
 * @property {string} id The id of the shipment.
 * @property {content(v2sandbox).OrderShipmentLineItemShipment[]} lineItems The line items that are shipped.
 * @property {string} status The status of the shipment.
 * @property {string} trackingId The tracking id for the shipment.
 */
/**
 * @typedef OrderShipmentLineItemShipment
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} lineItemId The id of the line item that is shipped.
 * @property {integer} quantity The quantity that is shipped.
 */
/**
 * @typedef OrdersAcknowledgeRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 */
/**
 * @typedef OrdersAcknowledgeResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersAcknowledgeResponse&quot;.
 */
/**
 * @typedef OrdersAdvanceTestOrderResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersAdvanceTestOrderResponse&quot;.
 */
/**
 * @typedef OrdersCancelLineItemRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).Price} amount Amount to refund for the cancelation. Optional. If not set, Google will calculate the default based on the price and tax of the items involved. The amount must not be larger than the net amount left on the order.
 * @property {string} lineItemId The ID of the line item to cancel.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {integer} quantity The quantity to cancel.
 * @property {string} reason The reason for the cancellation.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCancelLineItemResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCancelLineItemResponse&quot;.
 */
/**
 * @typedef OrdersCancelRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {string} reason The reason for the cancellation.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCancelResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCancelResponse&quot;.
 */
/**
 * @typedef OrdersCreateTestOrderRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} templateName The test order template to use. Specify as an alternative to testOrder as a shortcut for retrieving a template and then creating an order using that template.
 * @property {content(v2sandbox).TestOrder} testOrder The test order to create.
 */
/**
 * @typedef OrdersCreateTestOrderResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCreateTestOrderResponse&quot;.
 * @property {string} orderId The ID of the newly created test order.
 */
/**
 * @typedef OrdersCustomBatchRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).OrdersCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef OrdersCustomBatchRequestEntry
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {content(v2sandbox).OrdersCustomBatchRequestEntryCancel} cancel Required for cancel method.
 * @property {content(v2sandbox).OrdersCustomBatchRequestEntryCancelLineItem} cancelLineItem Required for cancelLineItem method.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} merchantOrderId The merchant order id. Required for updateMerchantOrderId and getByMerchantOrderId methods.
 * @property {string} method The method to apply.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order. Required for all methods beside get and getByMerchantOrderId.
 * @property {string} orderId The ID of the order. Required for all methods beside getByMerchantOrderId.
 * @property {content(v2sandbox).OrdersCustomBatchRequestEntryRefund} refund Required for refund method.
 * @property {content(v2sandbox).OrdersCustomBatchRequestEntryReturnLineItem} returnLineItem Required for returnLineItem method.
 * @property {content(v2sandbox).OrdersCustomBatchRequestEntryShipLineItems} shipLineItems Required for shipLineItems method.
 * @property {content(v2sandbox).OrdersCustomBatchRequestEntryUpdateShipment} updateShipment Required for updateShipment method.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryCancel
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} reason The reason for the cancellation.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryCancelLineItem
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).Price} amount Amount to refund for the cancelation. Optional. If not set, Google will calculate the default based on the price and tax of the items involved. The amount must not be larger than the net amount left on the order.
 * @property {string} lineItemId The ID of the line item to cancel.
 * @property {integer} quantity The quantity to cancel.
 * @property {string} reason The reason for the cancellation.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryRefund
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).Price} amount The amount that is refunded.
 * @property {string} reason The reason for the refund.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryReturnLineItem
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} lineItemId The ID of the line item to return.
 * @property {integer} quantity The quantity to return.
 * @property {string} reason The reason for the return.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryShipLineItems
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} carrier The carrier handling the shipment.
 * @property {content(v2sandbox).OrderShipmentLineItemShipment[]} lineItems Line items to ship.
 * @property {string} shipmentId The ID of the shipment.
 * @property {string} trackingId The tracking id for the shipment.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryUpdateShipment
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} carrier The carrier handling the shipment. Not updated if missing.
 * @property {string} shipmentId The ID of the shipment.
 * @property {string} status New status for the shipment. Not updated if missing.
 * @property {string} trackingId The tracking id for the shipment. Not updated if missing.
 */
/**
 * @typedef OrdersCustomBatchResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).OrdersCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCustomBatchResponse&quot;.
 */
/**
 * @typedef OrdersCustomBatchResponseEntry
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2sandbox).Errors} errors A list of errors defined if and only if the request failed.
 * @property {string} executionStatus The status of the execution. Only defined if the method is not get or getByMerchantOrderId and if the request was successful.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCustomBatchResponseEntry&quot;.
 * @property {content(v2sandbox).Order} order The retrieved order. Only defined if the method is get and if the request was successful.
 */
/**
 * @typedef OrdersGetByMerchantOrderIdResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersGetByMerchantOrderIdResponse&quot;.
 * @property {content(v2sandbox).Order} order The requested order.
 */
/**
 * @typedef OrdersGetTestOrderTemplateResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersGetTestOrderTemplateResponse&quot;.
 * @property {content(v2sandbox).TestOrder} template The requested test order template.
 */
/**
 * @typedef OrdersListResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of orders.
 * @property {content(v2sandbox).Order[]} resources 
 */
/**
 * @typedef OrdersRefundRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).Price} amount The amount that is refunded.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {string} reason The reason for the refund.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersRefundResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersRefundResponse&quot;.
 */
/**
 * @typedef OrdersReturnLineItemRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} lineItemId The ID of the line item to return.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {integer} quantity The quantity to return.
 * @property {string} reason The reason for the return.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersReturnLineItemResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersReturnLineItemResponse&quot;.
 */
/**
 * @typedef OrdersShipLineItemsRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} carrier The carrier handling the shipment.
 * @property {content(v2sandbox).OrderShipmentLineItemShipment[]} lineItems Line items to ship.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {string} shipmentId The ID of the shipment.
 * @property {string} trackingId The tracking id for the shipment.
 */
/**
 * @typedef OrdersShipLineItemsResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersShipLineItemsResponse&quot;.
 */
/**
 * @typedef OrdersUpdateMerchantOrderIdRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} merchantOrderId The merchant order id to be assigned to the order. Must be unique per merchant.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 */
/**
 * @typedef OrdersUpdateMerchantOrderIdResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersUpdateMerchantOrderIdResponse&quot;.
 */
/**
 * @typedef OrdersUpdateShipmentRequest
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} carrier The carrier handling the shipment. Not updated if missing.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {string} shipmentId The ID of the shipment.
 * @property {string} status New status for the shipment. Not updated if missing.
 * @property {string} trackingId The tracking id for the shipment. Not updated if missing.
 */
/**
 * @typedef OrdersUpdateShipmentResponse
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersUpdateShipmentResponse&quot;.
 */
/**
 * @typedef Price
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} currency The currency of the price.
 * @property {string} value The price represented as a number.
 */
/**
 * @typedef TestOrder
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).TestOrderCustomer} customer The details of the customer who placed the order.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#testOrder&quot;.
 * @property {content(v2sandbox).TestOrderLineItem[]} lineItems Line items that are ordered. At least one line item must be provided.
 * @property {content(v2sandbox).TestOrderPaymentMethod} paymentMethod The details of the payment method.
 * @property {string} predefinedDeliveryAddress Identifier of one of the predefined delivery addresses for the delivery.
 * @property {content(v2sandbox).OrderPromotion[]} promotions The details of the merchant provided promotions applied to the order. More details about the program are  here.
 * @property {content(v2sandbox).Price} shippingCost The total cost of shipping for all items.
 * @property {content(v2sandbox).Price} shippingCostTax The tax for the total shipping cost.
 * @property {string} shippingOption The requested shipping option.
 */
/**
 * @typedef TestOrderCustomer
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} email Email address of the customer.
 * @property {boolean} explicitMarketingPreference If set, this indicates the user explicitly chose to opt in or out of providing marketing rights to the merchant. If unset, this indicates the user has already made this choice in a previous purchase, and was thus not shown the marketing right opt in/out checkbox during the checkout flow. Optional.
 * @property {string} fullName Full name of the customer.
 */
/**
 * @typedef TestOrderLineItem
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {content(v2sandbox).TestOrderLineItemProduct} product Product data from the time of the order placement.
 * @property {integer} quantityOrdered Number of items ordered.
 * @property {content(v2sandbox).OrderLineItemReturnInfo} returnInfo Details of the return policy for the line item.
 * @property {content(v2sandbox).OrderLineItemShippingDetails} shippingDetails Details of the requested shipping for the line item.
 * @property {content(v2sandbox).Price} unitTax Unit tax for the line item.
 */
/**
 * @typedef TestOrderLineItemProduct
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {string} brand Brand of the item.
 * @property {string} channel The item&#39;s channel.
 * @property {string} condition Condition or state of the item.
 * @property {string} contentLanguage The two-letter ISO 639-1 language code for the item.
 * @property {string} gtin Global Trade Item Number (GTIN) of the item. Optional.
 * @property {string} imageLink URL of an image of the item.
 * @property {string} itemGroupId Shared identifier for all variants of the same product. Optional.
 * @property {string} mpn Manufacturer Part Number (MPN) of the item. Optional.
 * @property {string} offerId An identifier of the item.
 * @property {content(v2sandbox).Price} price The price for the product.
 * @property {string} targetCountry The CLDR territory code of the target country of the product.
 * @property {string} title The title of the product.
 * @property {content(v2sandbox).OrderLineItemProductVariantAttribute[]} variantAttributes Variant attributes for the item. Optional.
 */
/**
 * @typedef TestOrderPaymentMethod
 * @memberOf! content(v2sandbox)
 * @type object
 * @property {integer} expirationMonth The card expiration month (January = 1, February = 2 etc.).
 * @property {integer} expirationYear The card expiration year (4-digit, e.g. 2015).
 * @property {string} lastFourDigits The last four digits of the card number.
 * @property {string} predefinedBillingAddress The billing address.
 * @property {string} type The type of instrument. Note that real orders might have different values than the four values accepted by createTestOrder.
 */
module.exports = Content;
