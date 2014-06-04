'use strict';

exports.wiretree = function requestFactory (registryUrl, requestThen, proxyUri) {
  /**
   * Wraps requestThen.
   * Adds the registryUrl to the provided path.
   * Parses the response body as JSON.
   * @param {String} url
   * @param {Object} [options]
   * @returns {Promise}
   */
  return function request (path) {
    var options = {
      uri: registryUrl + path,
      json: true
    };

    if (typeof proxyUri === 'string')
      options.proxy = proxyUri;

    return requestThen(options);
  };
};
