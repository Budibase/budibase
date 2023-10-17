var warning = [
  'We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.\n',
  'Please migrate your code to use AWS SDK for JavaScript (v3).',
  'For more information, check the migration guide at https://a.co/7PzMCcy'
].join('\n');

module.exports = {
  suppress: false
};

/**
 * To suppress this message:
 * @example
 * require('aws-sdk/lib/maintenance_mode_message').suppress = true;
 */
function emitWarning() {
  if (typeof process === 'undefined')
    return;

  // Skip maintenance mode message in Lambda environments
  if (
    typeof process.env === 'object' &&
    typeof process.env.AWS_EXECUTION_ENV !== 'undefined' &&
    process.env.AWS_EXECUTION_ENV.indexOf('AWS_Lambda_') === 0
  ) {
    return;
  }

  if (
    typeof process.env === 'object' &&
    typeof process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE !== 'undefined'
  ) {
    return;
  }

  if (typeof process.emitWarning === 'function') {
    process.emitWarning(warning, {
      type: 'NOTE'
    });
  }
}

setTimeout(function () {
  if (!module.exports.suppress) {
    emitWarning();
  }
}, 0);
