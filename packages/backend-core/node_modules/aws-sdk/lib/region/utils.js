function isFipsRegion(region) {
  return typeof region === 'string' && (region.startsWith('fips-') || region.endsWith('-fips'));
}

function isGlobalRegion(region) {
  return typeof region === 'string' && ['aws-global', 'aws-us-gov-global'].includes(region);
}

function getRealRegion(region) {
  return ['fips-aws-global', 'aws-fips', 'aws-global'].includes(region)
      ? 'us-east-1'
      : ['fips-aws-us-gov-global', 'aws-us-gov-global'].includes(region)
      ? 'us-gov-west-1'
      : region.replace(/fips-(dkr-|prod-)?|-fips/, '');
}

module.exports = {
  isFipsRegion: isFipsRegion,
  isGlobalRegion: isGlobalRegion,
  getRealRegion: getRealRegion
};
