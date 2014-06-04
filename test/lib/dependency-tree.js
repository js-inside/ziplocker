'use strict';

describe('dependency tree', function () {
  var getDependencyTree = require('../../lib/get-dependency-tree').wiretree;
  var Promise = require('promise');
  var semver = require('semver');

  var packageJson, request, promise;

  beforeEach(function () {
    packageJson = {
      dependencies: {
        foo: '^0.0.1',
        bar: '~1.2.3'
      },
      optionalDependencies: {
        baz: '~3.4.7'
      }
    };

    request = jasmine.createSpy('request');

    request.when('foo').thenReturn(Promise.resolve({
      body: {
        versions: {
          '0.0.1': {},
          '0.0.2': {},
          '0.0.3': {}
        }
      }
    }));

    request.when('bar').thenReturn(Promise.resolve({
      body: {
        versions: {
          '1.2.3': {},
          '1.2.4': {},
          '1.3.0': {}
        },
        dependencies: {
          bap: '^3.2.1'
        }
      }
    }));

    request.when('baz').thenReturn(Promise.resolve({
      body: {
        versions: {
          '3.4.5': {},
          '3.4.6': {},
          '3.4.7': {},
          '3.4.8': {}
        }
      }
    }));

    request.when('bap').thenReturn(Promise.resolve({
      body: {
        versions: {
          '3.2.0': {},
          '3.2.1': {},
          '3.2.2': {}
        }
      }
    }));

    var dependencyTree = getDependencyTree(packageJson, request, Promise, semver);
    promise = dependencyTree();
  });

  it('should return a promise', function () {
    expect(promise).toEqual(jasmine.any(Promise));
  });

  it('should make a request for foo', function () {
    expect(request).toHaveBeenCalledWith('foo');
  });

  it('should make a request for bar', function () {
    expect(request).toHaveBeenCalledWith('bar');
  });

  it('should return a ziplock object', function (done) {
    promise.then(function checkResponse(ziplock) {
      expect(ziplock).toEqual({
        dependencies: {
          foo: {
            version: '0.0.1'
          },
          bar: {
            version: '1.2.4',
            dependencies: {
              bap: {
                version: '3.2.2'
              }
            }
          }
        },
        optionalDependencies: {
          baz: {
            version: '3.4.8'
          }
        }
      });

      done();
    });
  });
});
