"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsubscribe = unsubscribe;

var _channelSubscription = require("../commands-utils/channel-subscription");

function unsubscribe(...args) {
  if (args.length === 0) {
    (0, _channelSubscription.getSubscribedChannels)(this, this.channels).forEach(channel => {
      (0, _channelSubscription.unsubscribeFromChannel)(this, channel, this.channels);
    });
    return 0;
  }

  args.forEach(chan => {
    (0, _channelSubscription.unsubscribeFromChannel)(this, chan, this.channels);
  });
  const numberOfSubscribedChannels = (0, _channelSubscription.getSubscribedChannels)(this, this.channels).length;

  if (numberOfSubscribedChannels + (0, _channelSubscription.getSubscribedChannels)(this, this.patternChannels).length === 0) {
    this.subscriberMode = false;
  }

  return numberOfSubscribedChannels;
}