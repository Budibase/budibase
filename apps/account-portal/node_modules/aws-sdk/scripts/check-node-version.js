var version = process.version;

if (version && parseInt(version.substring(1, version.indexOf('.'))) < 10) {
  console.warn('The AWS SDK for JavaScript (v2) will no longer support Node.js ' + version
  + '\nas of November 1, 2021. To continue receiving updates to AWS services'
  + '\nand bug fixes please upgrade to Node.js 10.x or later.'
  + '\n\nMore information can be found at: https://a.co/cf10B3y');
}
