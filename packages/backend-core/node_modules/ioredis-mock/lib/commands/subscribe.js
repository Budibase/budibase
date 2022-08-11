"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribe = subscribe;

var _channelSubscription = require("../commands-utils/channel-subscription");

function subscribe(...args) {
  args.forEach(chan => {
    if (!this.channels.instanceListeners) {
      this.channels.instanceListeners = new Map();
    }

    (0, _channelSubscription.subscribeToChannel)(this, chan, this.channels);
  });

  if (!this.channels.instanceListeners) {
    return 0;
  }

  const numberOfSubscribedChannels = (0, _channelSubscription.getSubscribedChannels)(this, this.channels).length;

  if (numberOfSubscribedChannels > 0) {
    this.subscriberMode = true;
  }

  return numberOfSubscribedChannels;
}