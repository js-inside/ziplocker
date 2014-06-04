'use strict';

exports.wiretree = function requestFactory (registryUrl, thenRequest, _) {
  /**
   * Wraps thenRequest.
   * Adds the registryUrl to the provided path.
   * Parses the response body as JSON.
   * @param {String} url
   * @param {Object} [options]
   * @returns {Promise}
   */
  return function request () {
    var args = _.toArray(arguments);

    args[0] = registryUrl + args[0];

    return thenRequest.apply(thenRequest, args)
      .then(function (response) {
        response.body = JSON.parse(response.body);

        return response;
      });
  };
};
