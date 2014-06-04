'use strict';

describe('request', function () {
  var registryUrl, requestThen, request;
  var requestFactory = require('../../lib/request').wiretree;
  var Promise = require('promise');

  beforeEach(function () {
    registryUrl = 'https://registry.npmjs.org/';
    requestThen = jasmine.createSpy('requestThen');

    requestThen
      .when({
        uri: registryUrl + 'foo',
        json: true
      })
      .thenReturn(Promise.resolve({
        body: {
          foo: 'bar'
        }
      }));

    request = requestFactory(registryUrl, requestThen);
  });

  it('should be a function', function () {
    expect(request).toEqual(jasmine.any(Function));
  });

  it('should parse the response as JSON', function (done) {
    request('foo').then(function checkResponse (response) {
      expect(response).toEqual({
        body: {
          foo: 'bar'
        }
      });

      done();
    });
  });

  it('should call requestThen with a proxy', function () {
    requestFactory(registryUrl, requestThen, 'http://example.com:8080')('foo');

    expect(requestThen).toHaveBeenCalledWith({
      uri: registryUrl + 'foo',
      json: true,
      proxy: 'http://example.com:8080'
    });
  });
});
