"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.psubscribe = psubscribe;

var _channelSubscription = require("../commands-utils/channel-subscription");

function psubscribe(...args) {
  args.forEach(pattern => {
    if (!this.patternChannels.instanceListeners) {
      this.patternChannels.instanceListeners = new Map();
    }

    (0, _channelSubscription.subscribeToChannel)(this, pattern, this.patternChannels, true);
  });
  const numberOfSubscribedChannels = (0, _channelSubscription.getSubscribedChannels)(this, this.patternChannels).length;

  if (numberOfSubscribedChannels > 0) {
    this.subscriberMode = true;
  }

  return numberOfSubscribedChannels;
}