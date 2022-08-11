"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.punsubscribe = punsubscribe;

var _channelSubscription = require("../commands-utils/channel-subscription");

function punsubscribe(...args) {
  if (args.length === 0) {
    (0, _channelSubscription.getSubscribedChannels)(this, this.patternChannels).forEach(channel => {
      (0, _channelSubscription.unsubscribeFromChannel)(this, channel, this.patternChannels);
    });
  }

  args.forEach(pattern => {
    (0, _channelSubscription.unsubscribeFromChannel)(this, pattern, this.patternChannels);
  });
  const numberOfSubscribedChannels = (0, _channelSubscription.getSubscribedChannels)(this, this.patternChannels).length;

  if (numberOfSubscribedChannels + (0, _channelSubscription.getSubscribedChannels)(this, this.channels).length === 0) {
    this.subscriberMode = false;
  }

  return numberOfSubscribedChannels;
}