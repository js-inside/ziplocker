'use strict';

describe('request', function () {
  var registryUrl, thenRequest, request;
  var requestFactory = require('../../lib/request').wiretree;
  var lodash = require('lodash');
  var Promise = require('promise');

  beforeEach(function () {
    registryUrl = 'https://registry.npmjs.org/';
    thenRequest = function () {};
    thenRequest.apply = jasmine.createSpy('apply');

    thenRequest.apply
      .when(thenRequest, [registryUrl + 'foo'])
      .thenReturn(Promise.resolve({
        body: '{"foo": "bar"}'
      }));

    request = requestFactory(registryUrl, thenRequest, lodash);
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
});
